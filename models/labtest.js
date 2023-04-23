const { time } = require('console');
const express = require('express');
const { Int32 } = require('mongodb');
const mongoose = require('mongoose')

const labtests = new mongoose.Schema({
    doct:{type: String},
    doctors1:{type: String},
    formfill3:{type:String},
    package:{type:String},
    test:{type: String}
   
},{collection: 'Labtests'})
 
const Labtests = mongoose.model('Labtests',labtests)
 
module.exports = Labtests 