const mongoose = require('mongoose');


var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        index: true
    },
    previewSubtitle: {
        type: String,
        require: true,
        index: true
    },
    content: {
        type: Object,
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
    // numberOfLikes: {
    //     type: Number,
    //     default: 0,
    //     index: true
    // },
    likes: [{
        type: Object,
        ref: 'Like'
    }],
    bookmarkedUserIDs: [{
        type: String,
    }],

    author: {
        type: Object,
        required: true,
        ref: 'User',
    },
    comments: [{
        type: Object,
        ref: 'Comment'
    }],


}, { minimize: false });

module.exports = mongoose.model('Blog', blogSchema);