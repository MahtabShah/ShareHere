const express = require('express');
const router = express.Router();
const {Sentence, Comment} = require('../models/Sentence');
const Notification = require("../models/Notification")
const User = require("../models/User")
const Status = require("../models/Status")
const Report = require("../models/Report")
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { io } = require('../server');
// Helper to delete status older than 30s (for testing)



router.get('/crud', verifyToken,  async (req, res) => {
 
  const userId = req.user.userId || req.user.id;

  try {
    const user = await User.findById(userId)
   .populate({
    path: "status", // populate user's statuses
    populate: {
      path: "SeenBy",  // populate status.SeenBy
      model: "User",
      select: "name email username profile_pic bio", // fields from User
    },
  });

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
  .sort({ createdAt: -1 })
  .populate("user", "name email")
  .populate("likes", "name")
  .populate("comments.user", "name");


    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching user statuses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/comments/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {

    const all_sentences = await Sentence.findById(postId)
      .populate("comments") // first populate Comment IDs into objects
  .populate({
    path: "comments",
    populate: { path: "userId", model: "User" }
  }).sort({ createdAt: -1 }); // optional: newest posts first

    res.status(200).send(all_sentences.comments);
  } catch (error) {
    console.error("Error in /each_post_comments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


router.get("/get_userbyId/:userId", async (req, res) => {
const userId = req.params.userId;
  // console.log("userId", userId)
  try {

   const user = await User.findById(userId)
   .populate({
     path: "status",
    populate: [
      {
        path: "SeenBy",   // populate SeenBy users
        model: "User",
        select: "name email username profile_pic bio",
      },
      {
        path: "likes",    // populate likes users
        model: "User",
        select: "_id email username user profile_pic bio",
      },
    ],
  })
  .populate([
    {
      path: "followers",
      select: "_id name username bio profile_pic",
      
    },
    {
  path: "following",
  select: "_id name username bio profile_pic status",
  populate: {
    path: "status",
    populate: [
      {
        path: "SeenBy",   // populate SeenBy users
        model: "User",
        select: "name email username profile_pic bio",
      },
      {
        path: "likes",    // populate likes users
        model: "User",
        select: "_id email username user profile_pic bio",
      },
    ],
  },
},
  ]);

    // console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuu  " , user)
    

    res.status(200).json(user);

  } catch (error) {
    console.error("Error in /each_post_comments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/post_id/:id", async (req, res) => {
const id = req.params.id;
  // console.log("userId", id)
  try {

    const post = await Sentence.findById(id);
    

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in /each_post_comments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


router.get("/:id/followers", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: "followers",
        select: "_id name username bio profile_pic ", // fields to send
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit),
        },
      }).populate("followers")
      .select("followers");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      followers: user.followers,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id/following", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: "following",
        select: "_id name username bio profile_pic",
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit),
        },
      })
      .select("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      following: user.following,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /posts?search=keyword
// GET /posts?search=keyword&page=1&limit=10
router.get("/search", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = search
      ? { text: { $regex: search, $options: "i" } }
      : {};

    const posts = await Sentence.find(query).populate("userId")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Sentence.countDocuments(query);

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});




router.delete('/delete_status', verifyToken ,async (req, res) => {
  const userId = req.user.userId || req.user.id;
  const all_users = await User.find();
  const { status_id , id } = req.body;
  // console.log("data", userId, id)

  try {

    if(userId !== id) return res.status(403).json({ message: "Not authorized to delete this status" });

    await Status.findByIdAndDelete(status_id);
    const user = await User.findById(id);

    // console.log("Deleted status:");
    user.status = user.status.filter(s => s.toString() !== status_id);
    await user.save();

    res.status(200).json({
      message: "Old statuses deleted successfully."
    });

    io.emit('status');
    

  } catch (err) {
    console.error("Error deleting old statuses:", err);
    res.status(500).json({ message: "Failed to delete old statuses." });
  }
});




router.delete('/crud_delete_post', verifyToken,  async (req, res) => {
  const { id } = req.body;
 
  const userId = req.user.userId || req.user.id;
  // console.log("backend response 16 crud" ,userId , id)


  try {

    await Sentence.findByIdAndDelete(id);
    io.emit('update');
    // console.log("------------> " , sentence)
    res.status(201).json({ message: 'Sentence saved , see delete route' });
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});

router.delete("/:commentId", verifyToken, async (req, res) => {

  const {adminId , postId} = req.body


  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const postUserId = comment?.postId?.userId?.toString();

    // console.log("comment id - - ", comment)

    if (postUserId == req.user.id || comment?.userId?.toString() == req.user.id) {
          await Comment.findByIdAndDelete(req.params.commentId);
          res.json({ message: "Comment deleted" });

    }else{
      return res.status(403).json({ message: "Not authorized to delete this comment" });

    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/report/:commentId", verifyToken, async (req, res) => {
  // console.log("ic" , req.params.commentId)
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.reports.includes(req.user.id)) {
      return res.status(400).json({ message: "You already reported this comment" });
    }

    comment.reports.push(req.user.id);
    await comment.save();

    res.json({ message: "Comment reported" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




router.put('/crud_follow_post', verifyToken,  async (req, res) => {
  const { id ,  adminId} = req.body;
 

  try {
  const user_a = await User.findById(id); // post owener
  const user_b = await User.findById(adminId); // curr user
  // console.log("user b -" ,  user_b)

  const isFollowed = user_a.followers.includes(adminId);

  const newNotification = new Notification({
  "recipient": user_a._id,  // User B (original commenter)
  "sender": user_b._id,     // User C (who replied)
  "type": "follow",
  "isRead": false,
  })


  // console.log("new notifications - - - -- - - - -->" , newNotification)

  if (isFollowed) {
   user_a.followers = user_a.followers.filter(
   id => id.toString() !== user_b._id.toString()
   );

   user_b.following = user_b.following.filter(
    id => id.toString() !== user_a._id.toString()
   );

    await Notification.deleteMany({
         type: "follow",
         sender:  user_b._id,
         recipient:user_a._id,
       });
  
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

  ["Notification" , "status"].forEach(el=>{
  io.emit(el);

  })
  
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
  // console.log("user b -" ,  user_b)
    user_b.username = name || user_b.username;
    user_b.bio = bio || user_b.bio;
    user_b.profile_pic = profile_pic || user_b.profile_pic;
    user_b.cover_pic = cover_pic || user_b.cover_pic;

  // console.log("new formData - - - -- - - - -->" , name, bio, cover_pic)


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
    // console.log("------------> mark" , curr_notifications , user)
    res.status(201).json(curr_notifications);
  } catch (err) {
    console.error('Error deleting sentence:', err);
    res.status(500).json({ message: 'Failed to delete sentence' });
  }
});


// PUT: Update a status by ID

router.put("/set_status_seen/:id",async (req, res) => {
  const admin_id = req.params.id;
  const { status } = req.body;

  try {

       var st = await Status.findById(status?._id);

      if (!status?.SeenBy?.includes(admin_id)) {

        st?.SeenBy.push(admin_id);


      }
      await st.save();

      console.log("stttt ", st.SeenBy)




    io.emit('status');

    res.status(200).json({ message: "Statuses updated" , stS: status.SeenBy});
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.put("/like/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ message: isLiked ? "Unliked" : "Liked", likes: comment.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/dislike/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.id;
    const hasLiked = comment.likes.includes(userId);
    const hasDisliked = comment.dislikes.includes(userId);

    if (hasDisliked) {
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
    } else {
      comment.dislikes.push(userId);
      if (hasLiked) {
        comment.likes = comment.likes.filter(id => id.toString() !== userId);
      }
    }

    await comment.save();
    res.json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/like_status", async (req, res) => {
  const { admin_id , status} = req.body
  try {
    console.log("yes reaching. . ." , status)
    const st = await Status.findById(status?._id);

    if (status?.likes?.some(u=>u?._id === admin_id)) {

      st.likes = st?.likes?.filter(id=>id.toString() !== admin_id);
      console.log("stttttttttt = ", st.likes)

    }else{
      st?.likes.push(admin_id);
    }
    await st.save();



    io.emit("status")
    res.json({ message: "status like updation" , st});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




router.post("/create_status", async (req, res) => {
  const { text, image, user } = req.body;
  try {
    const new_user = await User.findById(user); 
    if (!new_user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = new Status({ text, image, user });
    await newStatus.save();

    if (Array.isArray(new_user.status)) {
      new_user.status.unshift(newStatus._id);
    } else {
      new_user.status = [newStatus._id];
    }
    await new_user.save();

    io.emit('status');
    io.emit('userUpdated', new_user);

    setTimeout(async () => {
      try {
        await Status.findByIdAndDelete(newStatus._id);
        new_user.status = new_user.status.filter(s => s.toString() !== newStatus._id.toString());
        await new_user.save();
        io.timeout(5000).emit('status');
        io.emit('userUpdated', new_user);
      } catch (err) {
        console.error("Error deleting old status:", err);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    res.status(201).json(newStatus);

  } catch (error) {
    console.error("Error creating status:", error);
    res.status(500).json({ message: "Failed to create status" });
  }
});


router.post("/post_seen/:id", async (req, res) => {
  try {
    const post = await Sentence.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment views by 1
      { new: true }
    );
    res.json({ success: true, views: post.views });
    io.timeout(5000).emit('sentence', post.toObject());
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/report_post", async (req, res) => {
 const { postId, reason, details } = req.body;

  if (!postId || !reason) {
    return res.status(400).json({ error: "postId and reason are required." });
  }

  try {
    const report = new Report({
      postId,
      reason,
      details,
    });

    await report.save();

    res.status(201).json({ message: "Report submitted successfully." });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


// Optional: GET endpoint to view all reports (for admin/testing)
router.get("/report_posts", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});



module.exports = router