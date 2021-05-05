const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    }

}, {
    timestamps: true,
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;