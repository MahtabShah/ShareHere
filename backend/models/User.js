const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bg_clr:{
    type: String,
    default: "#42b"
  },

  bio:{type:String},
  cover_pic:String , default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGtIXUGOHsmxJL3mQRqFe1K9xclHAJzAQOQ&s",

  profile_pic:String , default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGtIXUGOHsmxJL3mQRqFe1K9xclHAJzAQOQ&s",
  about_user:{type:String},

  followers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],

 notifications: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Notification'
  }],

  status:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status' 
  }],

  default: [],

  following:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }]



}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
