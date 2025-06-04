

const express = require('express');
const router = express.Router();
const {Sentence} = require('../models/Sentence');
const Notification = require("../models/Notification")
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');



router.get('/crud', verifyToken,  async (req, res) => {
 
  const userId = req.user.userId || req.user.id;
  // console.log("backend response 16 crud" ,userId)


  try {
    const user = await User.findById({_id:userId})
    // console.log("aaaaaaaaaaaaaaaaaaaaaa---> ", req.user, user)
    res.json(user)
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});


router.get('/all_notifications', verifyToken,  async (req, res) => {
  // const {mahtab} = req.body;
  const userId = req.user.userId || req.user.id;
  // console.log("backend response 16 crud" ,userId)


const curr_notifications = await Notification.find({ recipient: userId })
  .populate("comment")
  .populate("message")
  .populate("sender", "username profilePic")
  .sort({ createdAt: -1 });


  // const curr_notifications = all_notifications.filter((n)=>n.recipient.toString() === "683e9c9de6a3ce43ca32c3da")

  // console.log("all----notifi 39", curr_notifications)


  try {
    // const user = await User.findById({_id:userId})
    // console.log("aaaaaaaaaaaaaaaaaaaaaa---> ", req.user, user)
    res.json(curr_notifications)
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});




router.get("/each_post_comments", async (req, res) => {
  const postId = req.query.postId;
  console.log("postID", postId)
  try {

    const all_sentences = await Sentence.findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "userId",
        },
      })
      .sort({ createdAt: -1 }); // optional: newest posts first

    res.status(200).json(all_sentences);
  } catch (error) {
    console.error("Error in /each_post_comments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


router.get("/get_userbyId", async (req, res) => {
  const userId = req.query.userId;
  console.log("userId", userId)
  try {

    const user = await User.findById(userId)
    

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in /each_post_comments:", error);
    res.status(500).json({ message: "Server Error", error });
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

  const newNotification = new Notification({
    
  "recipient": user_a._id,  // User B (original commenter)
  "sender": user_b._id,     // User C (who replied)
  "type": "follow",
  "isRead": false,


  })



  // console.log("new notifications - - - -- - - - -->" , newNotification)

  if (isFollowed) {
    user_a.followers.pop(user_b._id)
    user_b.following.pop(user_a._id)
  }else{
    user_a.followers.push(user_b._id)
    user_b.following.push(user_a._id)
      await newNotification.save()

  }


   await user_a.save()
   await user_b.save()

   
// Emit a follow event with link to user profile
io.emit('userUpdated', user_a);
io.emit('userUpdated', user_b);
// io.emit('sentence');
    console.log("------------> follow" , user_a , user_b)
    res.status(201).json({ message: 'Sentence saved , see delete route' });
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});



router.put('/crud_mark_notification', verifyToken,  async (req, res) => {
  // const { curr_notifications } = req.body;
 
  const userId = req.user.userId || req.user.id;
  console.log("backend response 16 crud" ,userId)


  try {

  // const user_a = await User.findById(id); // post owener

  const user = await User.findById(userId); // curr user
  const curr_notifications = await Notification.find({recipient:userId})

  curr_notifications.forEach(async(n)=>{
     n.isRead = true;
     await n.save()
  })

    await user.save()

   
    io.emit('userUpdated', user);
    console.log("------------> mark" , curr_notifications , user)
    res.status(201).json(curr_notifications);
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});


module.exports = router