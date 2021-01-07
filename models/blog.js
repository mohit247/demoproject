const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogSchema = new schema({
    Title: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15
    },
    img: {
        path: String,
        
        
    },
    content:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 150
    },
    date: {
        type: Date,
            default: Date.now

    }
  


}, { timestamps: true});

module.exports =mongoose.model('Blog', blogSchema);