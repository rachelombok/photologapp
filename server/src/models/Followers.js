const mongoose = require('mongoose');

const { Schema } = mongoose;

const followersSchema = new Schema({
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
const Followers = mongoose.model('Followers', followersSchema);

module.exports = Followers;