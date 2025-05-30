const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {Sentence, Comment} = require('../models/Sentence');
const { io } = require('../server');
require("dotenv").config()


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
    const user = new User({ username, email, password: hashedPassword , bg_clr: random_clr });
    await user.save();

    const token = jwt.sign({ id: user._id }, 'secretkey');
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
    const all_sentence = await Sentence.find().populate({
    path: 'comments',
    populate: { path: 'userId', model: 'User' },
    // populate: { path: 'postId', model: 'Sentence' },
  })
  //  console.log("all user want ot fetching 77----: auth,js routes", all_sentence)

   try {
      res.json(all_sentence)
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







router.put("/like_this_post" , async (req, res)=>{
    const { id , isliked} = req.body
    const sentence = await Sentence.findById(id);


    isliked ? sentence.likes += 1 : sentence.likes -= 1
    await sentence.save()
    console.log("all user want ot fetching 58: auth,js routes", req.body, id , "and ", sentence);
    io.emit('sentence', sentence.toObject());
   try {
      res.json(sentence)
   } catch (error) {
    console.error("error in auth " , error)
   }
 
})


router.put("/set_comment_this_post" , async (req, res)=>{
    const { id , new_comment, headers} = req.body
    const sentence = await Sentence.findById(id)

    const token = headers.Authorization.split(" ")[1];
     const decoded = jwt.verify(token , process.env.JWT_SECRET)
     const useriid = decoded.id;
    //  console.log("User ID-==========>147 auth.js " , useriid );

     const update_new_comment = new Comment({
        text: new_comment,
        userId: useriid,
        postId: id,
    })
 
    await update_new_comment.save()
    sentence?.comments?.push(update_new_comment._id)

    await sentence.save()
    // console.log("all user want ot fetching 58: auth,js routes", new_comment, "id" , id , "and ", sentence, "user id -----\n",userId ,"update----\n", update_new_comment);
    io.emit('sentence', sentence.toObject());
   try {
      res.json(sentence)
   } catch (error) {
    console.error("error in auth " , error)
   }
})


module.exports = router;
