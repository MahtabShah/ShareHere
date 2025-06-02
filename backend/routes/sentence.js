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
    const pagesMetaRaw = req.body.pages_meta;

    const pagesMeta = Array.isArray(pagesMetaRaw)
      ? pagesMetaRaw.map((meta) => JSON.parse(meta))
      : [JSON.parse(pagesMetaRaw)];

    const files = req.files;
    const userId = req.user.id;




    console.log("-----------------------------l-----------------? " , req.user)
  

    let imgIndex = 0;
    const finalPages = pagesMeta.map((page) => {
      if (page.type === "img") {
        page.val = files[imgIndex]?.path; // Cloudinary gives `path` as secure URL
        imgIndex++;
      }
      return page;
    });

    console.log("pages............", finalPages)
    // Now save sentence to DB
    const newSentence = new Sentence({
      text: req.body.text,
      image_text: req.body.image_text,
      userId:userId,
      pages: finalPages,
    });

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
    const result = await Sentence.updateMany(
      // { bg_clr: { $exists: false } },
      // { $set: { bg_clr: `rgb(${randomNum() + 55}, ${randomNum() + 35}, ${randomNum() + 20})` } },

      // console.log(`rgb(${randomNum() + 55}, ${randomNum() + 35}, ${randomNum() + 20})`)
       { pages: { $exists: true } },
      { $set: { pages: [{}] } },
      // { following: { $exists: false } },
      // { $set: { following: [Object.id] } }
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
