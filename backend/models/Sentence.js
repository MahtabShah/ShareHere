const mongoose = require('mongoose');

const sentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  images: [String], // Ideal way to store image URLs
  image_text: {type:String},
  pages: [
    {
      type: { type: String },
      val: String, // bg-color, text, or image URL
      vibe: {type: String},
      pre_style:{},

    },
  ],

  category:{
    type:String,
    default:"all",

  },

  views: { type: Number, default: 0 },

  likes:[{
    type: mongoose.Schema.Types.ObjectId,
  }],

  mode:{
    type: String,
    enum: ["public" , "Follower" , "Paid"],
    default:"public"
  },

  createdAt:{
    type: Date,
    default: Date.now()

  }


}, {timestamps: true});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sentence' },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] ,// 👎
  createdAt:{
    type: Date,
    default: Date.now()
  }
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);
const Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = {Comment , Sentence}
