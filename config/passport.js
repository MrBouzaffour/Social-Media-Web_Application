const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Load user model
const User = require("../models/user.js")



module.exports = (passport) => {
    passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Match User
        User.findOne({ email: email }).then((user) => {
          if (!user) {
            return done(null, false, { message: "That email is not registered" });
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        }).catch((err) => {
          console.log(err);
          return done(null, false, { message: "Error occurred while authenticating" });
        });
      }) 
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id)
          .then(user => done(null, user))
          .catch(err => done(err, null));
      });  
}