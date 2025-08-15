const express = require('express');
const router = express.Router();
const {Sentence , Comment} = require('../models/Sentence');
const Status = require("../models/Status");
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');
const multer = require("multer");
const storage = require('../utils/storage');

// POST a sentence (Protected)


const upload = multer({ storage });

router.post("/post", verifyToken, upload.array("images"), async (req, res) => {
  try {

    // const files = req.files;
    const {ready_url , text , mode , id , category} = req.body;

    // Now save sentence to DB
    const newSentence = new Sentence({
      text: text,
      // image_text: req.body.image_text,
      images:[ready_url],
      userId:id,
      mode: mode,
      createdAt: Date.now(),
      category:category,
      // pages: finalPages,
    });

    console.log("new post at 53 - - - -- - - --->" , newSentence , id)
    await newSentence.save();
  io.emit('sentence', newSentence.toObject());

    res.status(200).json({ message: "Sentence saved", data: newSentence });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});







// GET all sentences by the logged-in user (Protected)
router.get('/my', verifyToken, async (req, res) => {
  // console.log('Fetching sentences for user exist or call here: calling----', req?.user);
  const userId = req.user.userId || req.user.id;

  try {
const sentences = await Sentence.find({ userId: userId }).populate('userId');;
// console.log(sentences, 'Sentences fetched for user:', userId);

    res.status(200).json(sentences);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sentences' });
  }
});

// 686e092731c47733a033aa51

router.get("/fix-sentences", async (req, res) => {
  try {

        const posts = await Sentence.find();
        const users = await User.find();

        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          for (let j = 0; j < posts.length; j++) {
            const post = posts[j];
            if (post.userId.toString() == user._id.toString()) {
              user.posts.push(post);
              await user.save()
            }
            
          }
          
        }
    
    // const result = await User.updateMany(
    //   {posts:{$exists: true}},
    //   {$set:{posts :[]}}
    // );
    res.json({ message: "Reports field added to comments without it", posts , users});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update comments" });
  }
});


router.get('/user_update/:user_id', async (req, res) => {
  const id = req.params.user_id;
  try {
    const result = await User.updateMany(
      {followers: {$exists: true}},
      {$set: {followers:  []}}
    );
    res.json({ message: 'Sentences updated', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update sentences' });
  }
});

const randomNum = ()=>{
  const val = Math.floor(Math.random() * 200)
  return val;
}

module.exports = router;
