const mongoose = require('mongoose');

//blogu atan kişinin idsi de olacak kullanıcı adı da olabilir

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    // each comment can only relates to one blog, so it's not in array
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    commenterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    commenterName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comment', commentSchema);