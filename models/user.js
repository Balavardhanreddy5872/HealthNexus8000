const { time } = require('console');
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const path = require('path');
app.use(express.urlencoded({ extended: false }));


const users = new mongoose.Schema({
   name:{type:String},
   email:{type:String},
   password:{type :String}
},{collection: 'user'})

const User = mongoose.model('users',users)

module.exports = User 