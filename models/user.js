const mongoose = require('mongoose');




const FriendSchema = new mongoose.Schema({
  name: { type: String },
  lastname: { type: String }, // Corrected field name
  friendId: { type: mongoose.Schema.Types.ObjectId }
});

const RequestSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  user_id: mongoose.Schema.Types.ObjectId,
  status: String
});

const SendRequestSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  user_id: mongoose.Schema.Types.ObjectId,
  status: String
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: { // Corrected field name
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reqfreinds: [RequestSchema], // Corrected typo in field name
  sentfreinds: [SendRequestSchema], // Corrected typo in field name
  friends: [FriendSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
