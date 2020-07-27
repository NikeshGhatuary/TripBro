const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');

const userSchema = new mongoose.Schema({
  /*name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },*/
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  isAdmin: Boolean

});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
}
const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    //name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  };

  
  return Joi.validate(user, schema);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) return callback(err);
    callback(null, isMatch);
  });
}

module.exports.getUserByEmail = function(email, callback){
  const query = {email: email};
  User.findOne(query, callback);
}
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

exports.User = User; 
exports.validate = validateUser;
