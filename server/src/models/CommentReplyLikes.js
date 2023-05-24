const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentReplyLikesSchema = new Schema(
  {
    commentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentReply",
    },
    likes: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CommentReplyLikes = mongoose.model(
  "CommentReplyLikes",
  commentReplyLikesSchema
);

module.exports = CommentReplyLikes;
