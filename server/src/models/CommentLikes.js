const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentLikesSchema = new Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
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

const CommentLikes = mongoose.model("CommentLikes", commentLikesSchema);

module.exports = CommentLikes;
