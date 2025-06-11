const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {Sentence, Comment} = require('../models/Sentence');
const { io } = require('../server');
require("dotenv").config()
const Notification = require("../models/Notification");
const verifyToken = require('../middleware/verifyToken');




const randomNum = ()=>{
  const val = Math.floor(Math.random() * 200)
  return val;
}


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const random_clr = `rgb(${randomNum() + 55}, ${randomNum() + 35}, ${randomNum() + 20})`

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword , bg_clr: random_clr ,  cover_pic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGtIXUGOHsmxJL3mQRqFe1K9xclHAJzAQOQ&s",

  profile_pic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGtIXUGOHsmxJL3mQRqFe1K9xclHAJzAQOQ&s",});
    await user.save();

    const token = jwt.sign({ id: user._id ,  username: user.username,
    email: user.email,},  process.env.JWT_SECRET,   { expiresIn: '7d' });
    res.status(201).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



router.get("/home" , async (req, res)=>{
      const users = await User.find();

  //  console.log("all user want ot fetching 58: auth,js routes", users);

   try {
      res.json(users)
   } catch (error) {
    console.error("error in auth " , error)
   }
 
})


router.get("/all_sentence" , async (req, res)=>{
  const limit = parseInt(req.query.limit) || 1000;
  const page = parseInt(req.query.page) || 0;
  const all_posts = await Sentence.find().sort({ createdAt: -1 }) // or use a `rank` field
  .skip(page * limit)
  .limit(limit).populate({
    path: 'comments',
    populate: { path: 'userId', model: 'User' },
    // populate: { path: 'postId', model: 'Sentence' },
  })
  //  console.log("all user want ot fetching 77----: auth,js routes", all_sentence)

   try {
      res.json(all_posts)
   } catch (error) {
    console.error("error in auth " , error)
   }
 
})


router.get("/all_post_comments" , async (req, res)=>{
    const all_sentence = await Sentence.find().populate({
    path: 'comments',
    populate: { path: 'userId', model: 'User' }
  })

  //  console.log("all user want ot fetching 58: auth,js routes", all_sentence);

   try {
      res.json(all_sentence)
   } catch (error) {
    console.error("error in auth " , error)
   }
 
})







router.put("/like_this_post", verifyToken ,async (req, res) => {
   const { id } = req.body;

  try {
    const token = req.headers['authorization'].split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const useriid = decoded.id;  // admin or logged user

    let post = await Sentence.findById(id); // no populate yet

    const isliked = post.likes.includes(useriid)
    isliked ? post.likes.pop(useriid) : post.likes.push(useriid)
    await post.save();

    // ✅ Re-fetch with populate after saving
    post = await Sentence.findById(id)
      .populate({
        path: "comments",
        populate: { path: "userId", model: "User" },
      })

    const newNotification = new Notification({
      recipient: post.userId,
      type: "like",
      isRead: false,
      post: post._id,
    });

    if (isliked) await newNotification.save();

    io.emit('sentence', post.toObject());
    io.emit('Notification');
    console.log("notification - -- - - - -" , newNotification)
    res.json(post);

  } catch (error) {
    console.error("error in like_this_post route:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


router.put("/set_comment_this_post", verifyToken ,async (req, res) => {
  const { id, new_comment, headers } = req.body;

  try {
    const token = req.headers['authorization'].split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const useriid = decoded.id;

    const post = await Sentence.findById(id);

    const update_new_comment = new Comment({
      text: new_comment,
      userId: useriid,
      postId: id,
    });

    await update_new_comment.save();
    post.comments.push(update_new_comment._id);
    await post.save();

    const newNotification = new Notification({
      recipient: post.userId,
      sender: useriid,
      type: "comment",
      isRead: false,
      post: post._id,
      comment: update_new_comment._id,
    });

    await newNotification.save();

    // ✅ Re-fetch with full population after save
    const populatedPost = await Sentence.findById(id)
      .populate({
        path: "comments",
        populate: { path: "userId", model: "User" },
      })

    io.emit('sentence', populatedPost.toObject());
    io.emit('Notification');

    res.json(populatedPost);

  } catch (error) {
    console.error("error in set_comment_this_post:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


module.exports = router;
