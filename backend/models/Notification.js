const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // who receives the notification
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // who triggered the notification
  },
  type: {
    type: String,
    enum: ['like', 'follow', 'comment', 'reply', 'message'],
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: function () {
      return ['like', 'comment', 'reply'].includes(this.type);
    },
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: function () {
      return ['reply'].includes(this.type);
    },
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: function () {
      return this.type === 'message';
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
