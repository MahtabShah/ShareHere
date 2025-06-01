

const express = require('express');
const router = express.Router();
const {Sentence} = require('../models/Sentence');
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');



router.get('/crud', verifyToken,  async (req, res) => {
 
  const userId = req.user.userId || req.user.id;
  console.log("backend response 16 crud" ,userId)


  try {
    const user = await User.findById({_id:userId})
    console.log("aaaaaaaaaaaaaaaaaaaaaa---> ", req.user, user)
    res.json(user)
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});




router.delete('/crud_delete_post', verifyToken,  async (req, res) => {
  const { id } = req.body;
 
  const userId = req.user.userId || req.user.id;
  console.log("backend response 16 crud" ,userId , id)


  try {

  const sentence = await Sentence.findByIdAndDelete(id);
    io.emit('sentence', sentence.toObject());
    // console.log("------------> " , sentence)
    res.status(201).json({ message: 'Sentence saved , see delete route' });
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});


router.put('/crud_follow_post', verifyToken,  async (req, res) => {
  const { id } = req.body;
 
  const userId = req.user.userId || req.user.id;
  console.log("backend response 16 crud" ,userId , id)


  try {

  const user_a = await User.findById(id); // post owener

  const user_b = await User.findById(userId); // curr user

  const isFollowed = user_a.followers.includes(userId);


  if (isFollowed) {
    user_a.followers.pop(user_b._id)
    user_b.following.pop(user_a._id)
  }else{
    user_a.followers.push(user_b._id)
    user_b.following.push(user_a._id)
  }


   await user_a.save()
   await user_b.save()

   
// Emit a follow event with link to user profile
io.emit('userUpdated', user_a);
io.emit('userUpdated', user_b);
    console.log("------------> follow" , user_a , user_b)
    res.status(201).json({ message: 'Sentence saved , see delete route' });
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});

module.exports = router