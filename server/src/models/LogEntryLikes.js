const mongoose = require('mongoose');

const { Schema } = mongoose;

const logEntryLikesSchema = new Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    likes: [
        {
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        }
    ]
}, {
    timestamps: true,
});

const LogEntryLikes = mongoose.model('LogEntryLikes', logEntryLikesSchema);

module.exports = LogEntryLikes;