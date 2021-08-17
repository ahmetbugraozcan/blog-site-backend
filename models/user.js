const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');

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


// userSchema.plugin(passportLocalMongoose);
// const User = new mongoose.model("User", userSchema);
// mongoose.set("useCreateIndex", true);

// module.exports = User