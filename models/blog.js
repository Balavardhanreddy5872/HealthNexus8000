const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  
    name: {
      type: String
      
    },
   
    subject :{
        type : String
    },

    message:{
     type : String
  }


},{collection: 'blogs'})

module.exports = mongoose.model('Blog', blogSchema); 
