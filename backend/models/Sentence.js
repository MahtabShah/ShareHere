const mongoose = require('mongoose');

const sentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number , default:0},
  images: [String], // Ideal way to store image URLs
  image_text: {type:String},
  pages: [
    {
      type: { type: String },
      val: String, // bg-color, text, or image URL
      vibe: {type: String},

    },
  ],

});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sentence' },
  likes: { type: Number , default:0}
});

const Comment = mongoose.model('Comment', commentSchema);
const Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = {Comment , Sentence}
