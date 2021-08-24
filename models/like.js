const mongoose = require('mongoose');

//blogu atan kişinin idsi de olacak kullanıcı adı da olabilir

const likeSchema = new mongoose.Schema({
    blog: {
        type: String,
    },
    // each comment can only relates to one blog, so it's not in array
    likerID: {
        type: String,
    }
})

module.exports = mongoose.model('Like', likeSchema);