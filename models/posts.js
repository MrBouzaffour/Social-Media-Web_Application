const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name:String,
  lastname:String,
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  liked_by: [{
    name:String,
    lastname:String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true

});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;