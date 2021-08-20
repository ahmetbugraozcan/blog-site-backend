const mongoose = require('mongoose');

//blogu atan kişinin idsi de olacak kullanıcı adı da olabilir

const commentSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    // each comment can only relates to one blog, so it's not in array
    likerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model('Like', commentSchema);