const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    userName: {
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
userSchema.plugin(passportLocalMongoose);
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);


// userSchema.plugin(passportLocalMongoose);
// const User = new mongoose.model("User", userSchema);
// mongoose.set("useCreateIndex", true);

// module.exports = User