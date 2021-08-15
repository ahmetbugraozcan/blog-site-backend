const mongoose = require('mongoose');


var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        index: true
    },
    content: {
        type: String,
        require: true,
        index: true

    },
    image: {
        type: String,
        required: true,
        index: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    numberOfView: {
        type: Number,
        default: 0,
        index: true
    },
    numberOfLikes: {
        type: Number,
        default: 0,
        index: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]

});

module.exports = mongoose.model('Blog', blogSchema);