const mongoose = require('mongoose');

const { Schema } = mongoose;

const followingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followers: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        }
    ]

});

const Following = mongoose.model('Following', followingSchema);

module.exports = Following;