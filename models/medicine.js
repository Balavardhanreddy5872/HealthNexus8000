const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const medicineSchema = new Schema({
  letter:{
    type: String,
    required: true
  },
  image:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  price1:{
    type:Number,
    required:true
  },
  price2:{
    type:Number,
    required:true
  },
},{ timestamps: true })

const medicine = mongoose.model('medicine',medicineSchema);
module.exports = medicine;
