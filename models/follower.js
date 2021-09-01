const mongoose = require('mongoose');


const followerSchema = new mongoose.Schema({
    follower: {
        type: Object,
        ref: 'User'
    },
    followedUsername: {
        type: String,
    }
})

module.exports = mongoose.model('Follower', followerSchema);