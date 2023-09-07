const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
const { ensureAuthenticated } = require('../config/auth');
const User = require("../models/user.js")
const Post = require("../models/posts.js")
const postController = require('../controllers/postcomment');



router.get('/comments',ensureAuthenticated, async (req, res) => {
    res.render("comments");
})
router.get('/freinds',ensureAuthenticated, async (req, res) => {
    const reqf = req.user.reqfreinds;
    list = []
    reqf.forEach(function(reqf){

      const name = reqf.name;
      const lastname = reqf.lastname;
      const id = reqf.user_id

      list.push({name,lastname,id})
      
    })
    const word = req.user.name + "/" + req.user.lastname;
  res.render("accept_reject",{list,word});
})

router.post("/accept",ensureAuthenticated, async (req, res) => {
  // req freinds from A
    const reqf = req.user.reqfreinds;

  // the id of B
    const id = req.body.accept;
    console.log(id);

    const userb = await User.findById(id);

      let j = -1;
      let reqIndex = -1
      reqf.forEach(function(reqf){
        j+=1
        if (reqf.user_id == id){
          reqIndex = j;
        }
      })
      const friendReq = reqf[reqIndex];
      req.user.reqfreinds.splice(friendReq, 1);
      req.user.friends.push({
        name: friendReq.name,
        lastname: friendReq.lastname,
        friendId: friendReq.user_id,
      });
      req.user.save();



      sentf = userb.sentfreinds;

      let i = -1;
      let sentIndex = -1
      sentf.forEach(function(sentf){
        i+=1
        if (sentf.user_id == req.user._id){
          sentIndex = i;
        }
      })      
      const friendsent = sentf[sentIndex];
      userb.sentfreinds.splice(friendsent, 1);
      userb.friends.push({
        name: req.user.name,
        lastname: req.user.lastname,
        friendId: req.user._id,
      });
      userb.save();
    




})
router.post("/reject",ensureAuthenticated, async (req, res) => {
  console.log("hello rejected");
})


//router.post("/comments",async(req,res) =>{
  //  const comment = req.body.comment;
  //  const userId = req.user._id;


  //  const newComment = new Post({
   //     user_id: userId,
   //     content: comment
   // });


  //  newComment.save()
   //     .then((comment) => {
   //         console.log(comment);
   //         res.redirect("feed")
    //    })
    //    .catch((err) => {
    //        console.error(err);
   // });

3   
//})
router.post("/removefreind",ensureAuthenticated,async (req, res) => {
  console.log("removed");
} )
router.post("/addfreind",ensureAuthenticated, async (req, res) => {
  // The info of B
  const userId = req.body.userId;
  const word = userId.split(" ");
  const name = word[0];
  const lastname = word[1];
  const users = await User.findOne({ name, lastname });

  // I will store this into A
  sent_user = { name:users.name,lastname:users.lastname,user_id:users._id,status:"Pending" }
  // I wil store this into B
  req_user = { name:req.user.name,lastname:req.user.lastname,user_id:req.user._id,status:"Pending" }
  
  // The req in A
  req.user.sentfreinds.push(sent_user);
  // the sent in B
  users.reqfreinds.push(req_user)
  
  // we saved
  users.save();
  req.user.save();
  //console.log(users);
  //console.log("______");
  //console.log(req.user);



        //const users = await User.findOne({ name, lastname });
  // try {
      //  const userId = req.body.userId;
       //   console.log(userId);
        //  // const person = await postController.getUserById(userId);
         // 
          //if (!person) {
          //  console.log("Person not found");
           // res.redirect("feed"); // Redirect to the feed page or render an error message
           // return;
          //}
      
          //else if ( person._id.equals(req.user._id)) {
           
          //  console.log("You You are trying to add yourse");
          // res.redirect("feed"); // Redirect to the feed page or render an error message
          //  return;
          //}
      

         // else{
          //    req.user.
            // this code will add users to their collection
           // req.user.friends.push({ friendId: person._id,name:person.name,lastname:person.lastname });
             //await req.user.save();
      
          //console.log("Friend added:", person.name, person.lastname);
          //res.redirect("feed"); // Redirect to the feed page or render a success message
          //}
          
      //  } catch (error) {
       //   console.log("Error:", error);
        //  // Handle the error appropriately
         // res.redirect("feed"); // Redirect to the feed page or render an error message
      //}
    //  
  });
      

  router.get('/:firstName/:lastName', ensureAuthenticated, async function(req, res) {
    const name = req.params.firstName;
    const lastname = req.params.lastName;
  
    try {
      const users = await User.findOne({ name, lastname });
      const posts = await postController.getSortedUserPosts(users._id);
      const UserName = name.concat(" ", lastname);
      let isFriend = false;
  
      if (req.user.name === name && req.user.lastname === lastname) {
        res.render("Profile", { UserName, posts });
        return;
      }
  
      // Check if the current user is a friend of the profile being viewed
      for (const friend of req.user.friends) {
        if (friend.friendId && friend.friendId.equals && friend.friendId.equals(users._id)) {
          isFriend = true;
          break;
        }
      }
  
      const dd = users._id;
      res.render("UserProfile", { UserName, posts, dd, isFriend });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error finding user');
    }
  });
  
  
router.post('/search', ensureAuthenticated, async (req, res) => {
    const input = req.body.search_bar;
    //console.log(input);
    const word = input.split(" ");

    const name = word[0];
    const lastname = word[1];
    //console.log(name);
    //console.log(lastname);
    res.redirect("/dashboard/"+name+"/"+lastname)
    
  });


  router.post('/addLike', ensureAuthenticated, async (req, res) => {
    try {
      const postId = req.body.postId;
      const userId = req.user._id;
      const post = await Post.findById(postId);
      let alreadyLiked = false;
  
      post.liked_by.forEach(function(item) {
        if (item.user_id.equals(userId)) {
          alreadyLiked = true;
          console.log("already liked");
          res.json({ likes: post.likes });
        }
      });
  
      if (alreadyLiked) {
        res.json({ likes: post.likes });
      } else {
        post.likes += 1;
        post.liked_by.push({ user_id: userId, name: req.user.name, lastname: req.user.lastname });
        await post.save();
        console.log("Post liked");
  
        res.json({ likes: post.likes });
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  router.get('/feed', ensureAuthenticated, async (req, res) => {
    let list = [];
    const friends = req.user.friends; // Corrected variable name
    for (const friend of friends) { // Changed variable name to friend
      const fId = friend.friendId; // Changed variable name to friend
      const posts = await postController.getSortedUserPosts(fId);
      posts.forEach(function(post) {
        const username = post.name.concat(" ", post.lastname);
        const content = post.content;
        const likes = post.likes;
        const pId = post._id;
        list.push({ username, content, likes, pId });
      });
    }
    const word = req.user.name + "/" + req.user.lastname; // Added missing const keyword
    res.render('feed', { friend: friends, list, word }); // Corrected passing of friend variable
  });
  
  

router.post("/feed",ensureAuthenticated,async(req,res) =>{
    const post = req.body.post;
    const userId = req.user._id;
    const newPost = new Post({
        name: req.user.name,
        lastname: req.user.lastname,
        user_id: userId,
        content: post

    });
    newPost.save()
        .then((post) => {
            res.redirect("feed")
        })
        .catch((err) => {
            console.error(err);
    });


    
})

module.exports = router;
