const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // Other user properties
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number, // Add a quantity property to track the item quantity
    }
  ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
