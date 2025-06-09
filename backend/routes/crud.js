

const express = require('express');
const router = express.Router();
const {Sentence} = require('../models/Sentence');
const Notification = require("../models/Notification")
const User = require("../models/User")
const Status = require("../models/Status")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');



router.get('/crud', verifyToken,  async (req, res) => {
 
  const userId = req.user.userId || req.user.id;
  // console.log("backend response 16 crud" ,userId)


  try {
    const user = await User.findById({_id:userId})
        console.log("aaaaaaaaaaaaaaaaaaaaaa---> ", req.user, user)
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
  .populate("sender")
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

router.get("/all_status", async (req, res) => {
  try {
    const all_statuses = await Status.find()
      .populate("user", "name email") // populate user with only name and email
      .populate("likes", "name")      // populate likes with name
      .populate("comments.user", "name"); // populate comments.user with name

    res.status(200).json(all_statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user_status/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const statuses = await Status.find({ user: userId })
      .populate("user", "name email")
      .populate("likes", "name")
      .populate("comments.user", "name");

    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching user statuses:", error);
    res.status(500).json({ message: "Internal server error" });
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


router.get("/get_userbyId/:userId", async (req, res) => {
const userId = req.params.userId;
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

  try {
  const user_a = await User.findById(id); // post owener
  const user_b = await User.findById(userId); // curr user
  console.log("user b -" ,  user_b)

  const isFollowed = user_a.followers.includes(userId);
  const newNotification = new Notification({
  "recipient": user_a._id,  // User B (original commenter)
  "sender": user_b._id,     // User C (who replied)
  "type": "follow",
  "isRead": false,
  })

  console.log("new notifications - - - -- - - - -->" , newNotification)

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
  io.emit('Notification');
  
    // console.log("------------> follow" , user_a , user_b)
    res.status(201).json({ message: 'Sentence saved , see delete route' });
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to follow' });
  }
});



router.put('/update_user', verifyToken,  async (req, res) => {
  const { name, bio, profile_pic, cover_pic } = req.body;
  const userId = req.user.userId || req.user.id;

  try {
  const user_b = await User.findById(userId); // curr user
  if (!user_b) return res.status(404).json({ msg: "User not found" });
  console.log("user b -" ,  user_b)
    user_b.username = name || user_b.username;
    user_b.bio = bio || user_b.bio;
    user_b.profile_pic = profile_pic || user_b.profile_pic;
    user_b.cover_pic = cover_pic || user_b.cover_pic;

  console.log("new formData - - - -- - - - -->" , name, bio, cover_pic)


  await user_b.save()
   
  // Emit a follow event with link to user profile
  io.emit('userUpdated', user_b);
  
  res.status(200).json({
      msg: "Profile updated successfully",
      profile_pic: user_b.profile_pic,
      cover_pic: user_b.cover_pic,
    });
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to follow' });
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


// PUT: Update a status by ID
router.put("/update_status/:id", async (req, res) => {
  const statusId = req.params.id;
  const { text, image, user } = req.body;

  try {
    const updatedStatus = await Status.findByIdAndUpdate(
      statusId,
      {
        text,
        image,
        user,
      },
      { new: true, runValidators: true } // return the updated doc
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: "Status not found" });
    }

    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/create_status", async (req, res) => {
  const { text, image, user } = req.body;
  try {
    const new_user = await User.findById(user); 
    const newStatus = new Status({ text, image, user });
    await new_user?.status?.unshift(newStatus)
    await new_user.save()
    await newStatus.save()
    io.emit('status', newStatus.toObject());
    io.emit('userUpdated', new_user);

    

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating status:", error);
    res.status(500).json({ message: "Failed to create status" });
  }
});



module.exports = router