const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')

const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport"); 

const app = express();
app.use(express.static('public'));

// passport config
require('./config/passport')(passport);


//mongoose
mongoose.connect('mongodb://127.0.0.1:27017/Betaweb1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));


// express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next(); 
 
})
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));



app.listen(3000); 
