// user.js (User Schema)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // Other user properties
  cart: [  // This array will store cart items
    {
      name: String,
      price: Number
    }
  ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;

