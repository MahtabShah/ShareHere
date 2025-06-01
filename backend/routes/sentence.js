const express = require('express');
const router = express.Router();
const {Sentence} = require('../models/Sentence');
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');
const multer = require("multer");
const storage = require('../utils/storage');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Ensure this folder exists or create it
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });


// Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(401).json({ message: 'Token required' });

//   try {
//     const decoded = jwt.verify(token, 'secretkey');
//     req.user = decoded; // contains user id
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };






// POST a sentence (Protected)

const upload = multer({ storage: storage });

// router.post('/post', verifyToken, upload.single('image'),async (req, res) => {
//   // console.log("/post at line 23 res.user ", req.user)
//   const {images,  text} = req.body;
//   // const imagePaths = req.files.map(file => file.path);
//   console.log(text, "images....", images)

//   const userId = req.user.userId || req.user.id;
//   try {
//     const sentence = new Sentence({
//       text,
//       userId: userId,
//       images: req.file.path ,
//     });

//     await sentence.save();

//     // 🔴 Emit sentence to all connected clients
//     io.emit('sentence', sentence.toObject());


//   console.log("/post at line 31, sentence : " , sentence)

//     res.status(201).json({ message: 'Sentence saved', sentence });
//   } catch (err) {
//   console.error('Error saving sentence:', err);
//   console.log("logs---------->" , imagePaths)
//     res.status(500).json({ message: 'Failed to save sentence' });
//   }
// });




router.post('/post', verifyToken, upload.array('images'), async (req, res) => {
  const { text, image_text } = req.body;
  const files = req.files;

  // Parse Pre_Image[] (may come as object if multiple or string if one)
  let Pre_Image = [];
  if (Array.isArray(req.body.Pre_Image)) {
    Pre_Image = req.body.Pre_Image;
  } else if (typeof req.body.Pre_Image === 'string') {
    Pre_Image = [req.body.Pre_Image];
  } else {
    Pre_Image = Object.values(req.body).filter((val, key) => val?.startsWith("Pre_Image["));
  }

  const fileImageUrls = files?.map(file => file.path) || [];
  const allImages = [...fileImageUrls, ...Pre_Image];

  const userId = req.user.userId || req.user.id;

  try {
    const sentence = new Sentence({
      text,
      userId,
      image_text,
      images: allImages,
    });

    await sentence.save();

    io.emit('sentence', sentence.toObject());

    res.status(201).json({ message: 'Sentence saved', sentence });
  } catch (err) {
    console.error('Error saving sentence:', err);
    res.status(500).json({ message: 'Failed to save sentence' });
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
       { image_text: { $exists: false } },
      { $set: { image_text: "" } },
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
