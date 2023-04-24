const mongoose = require('mongoose');

const medicines1 = new mongoose.Schema({
  image:{
    type:String,
  },
  name:{
    type:String,
  },
  price1:{
    type:Number,
  },
  price2:{
    type:Number,
  },
},{ collection: 'medicine1' })

const medicine1 = mongoose.model('medicine1',medicines1);
module.exports = medicine1;       