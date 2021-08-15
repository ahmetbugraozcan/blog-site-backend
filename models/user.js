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
    local: {
        email: String,
        password: String,
    },
});
userSchema.plugin(passportLocalMongoose);
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);


// userSchema.plugin(passportLocalMongoose);
// const User = new mongoose.model("User", userSchema);
// mongoose.set("useCreateIndex", true);

// module.exports = User