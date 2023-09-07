const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/user.js")
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const passport = require("passport"); 




// register handle
//router.get('/register', (req, res) => {
 // res.render('register');
//});

router.get('/register', (req,res)=>{
  res.render('register');
})

router.post('/register', async (req, res) => {

  const { name,lastname, email, password, password2 } = req.body;

  let errors = []
  if(!name || !lastname ||!email || !password || !password2){
    errors.push({msg: "Please fill in all the fields."});
  }
  if (password !== password2){
    errors.push({msg: "Passwords do not match."})
  }
  if(password.length < 6){
    errors.push({msg: "Password should be at least 6 characters."})
  }
  if (errors.length > 0){
    res.render('register', {
        errors,
        name,
        lastname,
        email,
        password,
        password2,
        status
    });
  } else {
    try {
      const user = await User.findOne({ email: email });

      if (user) {
        // User exists
        errors.push({ msg: "Email is already registered." });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name: name,
          lastname,
          email: email,
          password: hashedPassword,
        });
        
        await newUser.save();
        req.flash("success_msg","You are now registred and ready to login")
        res.redirect('/dashboard/feed');
      }
    } catch (err) {
      console.log(err);
    }              
  }
});




// login handle
router.get('/login', (req, res) => {
  res.render('login');
})
//login handel

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard/feed',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});




//logout handel
router.get('/logout', (req, res) => {
  req.logOut((err) =>{
    if(err){
      return next(err)
    }
    req.flash("success_msg","you are logged out")
    res.redirect('/users/login')
  });

});
module.exports = router;
