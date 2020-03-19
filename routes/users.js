const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
   
  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('User already registered.');
  
  user = new User(_.pick(req.body, ['email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email']));
  // res.render('index')
});

router.get('/register', async (req, res) => {
  res.render('register');
});


router.post('/signup', async function(req, res) {
  //let tripbro = _.pick(req.body, ['email', 'password']);

  // tripbro = {
  //   'email':tripbro.Email,
  //   'password': tripbro.password 
  // };

  // validate(tripbro);
  let user = new User(_.pick(req.body, ['email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  // res.send(user);
});

router.get('/', async (req, res) => {
  const users = await User.find().sort('email');
  res.send(users);
});

router.delete('/:id', async (req, res) => {
  const users = await User.findByIdAndRemove(req.params.id);

  if (!users) return res.status(404).send('The user with the given ID was not found.');

  res.send(users);
});

module.exports = router;