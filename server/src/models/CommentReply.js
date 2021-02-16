const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentReplySchema = new Schema({
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
      text: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
}, {
    timestamps: true,
});

const CommentReply = mongoose.model('CommentReply', commentReplySchema);

module.exports = CommentReply;