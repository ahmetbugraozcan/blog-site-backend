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
        default: "https://res.cloudinary.com/practicaldev/image/fetch/s--Z2Tv4-O4--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/498048/3d29cbb2-80bf-4771-8415-38fa01b01390.jpg",
    },
    
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});


module.exports = mongoose.model('User', userSchema);
