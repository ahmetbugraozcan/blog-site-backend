const mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    userName:{
        type:String,
        require:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('User', userSchema);