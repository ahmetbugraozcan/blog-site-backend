const mongoose = require('mongoose');


const followerSchema = new mongoose.Schema({
    follower: {
        type: Object,
        ref: 'User'
    }
})

module.exports = mongoose.model('Follower', followerSchema);