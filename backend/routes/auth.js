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
    const existingUser = await User.findOne({ $and: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const random_clr = `rgb(${randomNum() + 55}, ${randomNum() + 35}, ${randomNum() + 20})`

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword , bg_clr: random_clr ,  cover_pic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGtIXUGOHsmxJL3mQRqFe1K9xclHAJzAQOQ&s",

    profile_pic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGtIXUGOHsmxJL3mQRqFe1K9xclHAJzAQOQ&s",});
    await user.save();

    const token = jwt.sign({ id: user._id ,  username: user.username,
    email: user.email,},  process.env.JWT_SECRET,   { expiresIn: '1y' });
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
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1y' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



router.get("/home" , async (req, res)=>{
    const users = await User.find();
   try {
    res.json(users)
   } catch (error) {
    console.error("error in auth " , error)
   }
 
})


router.get("/all_sentence", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2; // default 10
    const page = parseInt(req.query.page) || 0;
    const category = req.query.category;
    let posts;

    if (category==="all") {
     posts = await Sentence.find().sort({ createdAt: -1 }) // newest first
      .skip(limit * page)
      .limit(limit)
      .populate("comments")
      .populate(
    {
      path: "comments",
      populate: { path: "userId", model: "User" },
    }
   );

       
    }else{
      posts = await Sentence.find({category: category}).sort({ createdAt: -1 }) // newest first
      .skip(limit * page)
      .limit(limit)
      .populate("comments")
      .populate(
    {
      path: "comments",
      populate: { path: "userId", model: "User" },
    }
  );


    }


    
    res.json(posts);
  } catch (error) {
    console.error("Error fetching sentences:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/all_post/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await User.findById(userId).populate("posts") // find all posts for that user
    

    res.send(posts);
  } catch (error) {
    console.error("Error fetching sentences:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get("/all_post_comments" , async (req, res)=>{
    const all_sentence = await Sentence.find().populate({
    path: 'comments',
    populate: { path: 'userId', model: 'User' }
  }).sort({ createdAt: -1 }) // newest first

  //  console.log("all user want ot fetching 58: auth,js routes", all_sentence);

   try {
      res.json(all_sentence)
   } catch (error) {
    console.error("error in auth " , error)
   }
 
})



router.put("/like_this_post", verifyToken ,async (req, res) => {
   const { id , adminId} = req.body;

  try {
  // admin or logged user

    let post = await Sentence.findById(id); // no populate yet


    const isliked = post.likes.includes(adminId)
    isliked ? post.likes.pop(adminId) : post.likes.push(adminId)
    await post.save();

    console.log(post)


    // ✅ Re-fetch with populate after saving
    // post = await Sentence.findById(id)
      // .populate({
      //   path: "comments",
      //   populate: { path: "userId", model: "User" },
      // })

   const newNotification = new Notification({
      recipient: post.userId,
      type: "like",
      sender: adminId, 
      isRead: false,
      post: post._id,
    });

    if (isliked){
      await Notification.deleteOne({
       post: post._id,
       type: "like",
       sender: adminId,
     });

    }else{
       await newNotification.save();

    }


    io.emit('sentence' , post);
    io.emit('Notification');
    console.log("notification - -- - - - -" , newNotification)
    res.json(post);

  } catch (error) {
    console.error("error in like_this_post route:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


router.put("/set_comment_this_post", verifyToken ,async (req, res) => {
  const { id, new_comment, adminId } = req.body;

  try {
 
    const useriid = adminId;

    const post = await Sentence.findById(id);

    const update_new_comment = new Comment({
      text: new_comment,
      userId: useriid,
      postId: id,
      createdAt:Date.now()
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

    io.emit('sentence', populatedPost);
    io.emit('Notification');

    res.send(populatedPost);

  } catch (error) {
    console.error("error in set_comment_this_post:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


module.exports = router;
