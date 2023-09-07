const Post = require('../models/posts');
const User = require("../models/user.js")

async function getSortedUserPosts(userId) {
  try {
    const posts = await Post.find({ user_id: userId }).sort({ created_at: -1 });
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



async function getUsersbyEmail(email) {
  try {
    const user = await User.findOne({ email:email });
      return user
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getUserById(id) {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function isFriend(user, friendId) {
  for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].friendId.toString() === friendId.toString()) {
          return true;
      }
  }
  return false;
}

async function getFriendNames(user) {
  let friendNames = [];

  for (let friend of user.friends) {
      let friendDoc = await User.findOne({_id: friend.friendId});
      if (friendDoc) {
          friendNames.push(`${friendDoc.name} ${friendDoc.lastname}`);
      }
  }

  return friendNames;
}



module.exports = { getSortedUserPosts,getUsersbyEmail,isFriend,getFriendNames,getUserById };