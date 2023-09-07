const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth")
//welcome page
router.get('/', (req,res)=>{
    res.render('welcome');
})
//dashboard page

router.get('/register', (req,res)=>{
    res.render('register');
})

module.exports = router; 