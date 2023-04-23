const mongoose = require('mongoose');

const reviews = new mongoose.Schema({
  
    name: {
      type: String
      
    },
   
   email :{
        type : String,
        require : true
    },

    rating:{
        type: String,
        require : true
    },

    review :{
        type : String
    }


},{collection: 'reviews'})

module.exports = mongoose.model('reviews', reviews); 
