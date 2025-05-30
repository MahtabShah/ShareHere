const mongoose = require('mongoose');

const sentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number , default:0}
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
