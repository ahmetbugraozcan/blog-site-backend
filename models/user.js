
const mongoose = require('mongoose');
//fotoğraf da eklenecek

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    
    username: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },

    email: {
        type:String,
        require:true,
        index:true,
        unique: true,
    },

    password: {
        type:String,
        require:true,
        index:true,
        unique: true,
    },

    profilePhotoUrl: {
        type: String,
        index: true,
        default: "https://www.shareicon.net/data/128x128/2017/01/06/868320_people_512x512.png",
    },
    
    followers: [{
        type: Object,
        ref: 'User'
    }],

    bookmarks: [{
        type: Object,
        ref: 'Bookmark'
    }],

    following: [{
        type: Object,
        ref: 'User'
    }]
},
{ minimize: false });


module.exports = mongoose.model('User', userSchema);
