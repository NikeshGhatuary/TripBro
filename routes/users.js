const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt'); 
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const expressValidate = require('express-validator');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require ('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const router = express.Router();


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(email, password, done){
    User.getUserByEmail(email, function(err, user){
      if(err) throw err;
      if(!user){
        console.log('Unknown user');
        return done(null, false, {message: 'Invalid email or password!'});
      }
      
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }
        else {
          console.log('Incorrect Password!');
          return done(null, false, {message:'Incorrect Password!'});
        }
      });

    });
  }
));

router.post('/signin', passport.authenticate('local',{failureRedirect:'/users/signin', failureFlash:'Invalid email or password'}), function(req, res){
  console.log('Authentication Successful');
  req.flash('success', 'You are logged in!');
  res.redirect('/loggedin/logged_in');

});



router.get('/register', async (req, res) => {
  res.render('register');
});


router.post('/signup', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  
  if(password === req.body.confirm_password){
      let newUser = new User(_.pick(req.body, ['email', 'password']));
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      console.log(newUser);
      newUser.save();
      res.send(newUser);
      res.redirect('/');
  } 
  else {
      console.log("Password do not match!");
      req.flash('error', 'Password do not match!');
    }
    
});


router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out!');
  res.redirect('/');
});



router.get('/', async (req, res) => {
  const users = await User.find().sort('email');
  res.send(users);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const users = await User.findByIdAndRemove(req.params.id);

  if (!users) return res.status(404).send('The user with the given ID was not found.');

  res.send(users);
});

module.exports = router;

