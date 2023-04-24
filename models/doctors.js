const { time } = require('console');
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const path = require('path');
app.use(express.urlencoded({ extended: false }));


const doctors = new mongoose.Schema({
   doct:{type: String},
   doctors1:{type: String},
   name:{type:String},
   mail:{type:String},
   date:{type: String},
},{collection: 'Doctors'})

const Doctors = mongoose.model('Doctors',doctors)

module.exports = Doctors