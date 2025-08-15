
const express = require('express');
const router = express.Router();
const {Sentence} = require('../models/Sentence');
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');



router.get('/id', verifyToken,  async (req, res) => {
 
  const userId = req.user.userId || req.user.id;
  console.log("backend response 16 crud" ,userId)


  try {
    // const user = await User.findById({_id:userId})
    // console.log("aaaaaaaaaaaaaaaaaaaaaa---> ", req.user, user)
    // res.json(user)
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});


router.get('/fix' , async (req,res)=>{
try {
    const posts = await Sentence.find();

    // const res = await User.updateMany(
    // {posts:{$exists:false}},
    // {$set:{posts:[]}}
  // )

  res.json({message:"updated", posts})
} catch (error) {
  console.error(error)
}
})

module.exports = router;