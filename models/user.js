const mongoose = require('mongoose');

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
});


module.exports = mongoose.model('User', userSchema);
