const express = require('express');
const router = express.Router();
const {Sentence} = require('../models/Sentence');
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
    const {ready_url , text} = req.body;
    const userId = req.user.id;



    // Now save sentence to DB
    const newSentence = new Sentence({
      text: text,
      // image_text: req.body.image_text,
      images:[ready_url],
      userId:userId,
      // pages: finalPages,
    });

    console.log("new post at 53 - - - -- - - --->" , newSentence)
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


router.get('/fix-sentences', async (req, res) => {
  try {
    const result = await User.updateMany(
      // { bg_clr: { $exists: false } },
      // { $set: { bg_clr: `rgb(${randomNum() + 55}, ${randomNum() + 35}, ${randomNum() + 20})` } },

      // console.log(`rgb(${randomNum() + 55}, ${randomNum() + 35}, ${randomNum() + 20})`)
      //  { pages: { $exists: true } },
      // { $set: { pages: [{}] } },
      { status: { $exists: false } },
      { $set: { status: [] } }
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
