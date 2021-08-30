const mongoose = require('mongoose');

//blogu atan kişinin idsi de olacak kullanıcı adı da olabilir

const bookmarkSchema = new mongoose.Schema({
    blog: {
        type: Object,
        ref: 'Blog'
    },
    // each comment can only relates to one blog, so it's not in array
    bookmarkedUserID: {
        type: String,
    }
})

module.exports = mongoose.model('Bookmark', bookmarkSchema);