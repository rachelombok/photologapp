const mongoose = require("mongoose");

const { Schema } = mongoose;

const logEntryLikesSchema = new Schema({
    logEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LogEntry",
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

const LogEntryLikes = mongoose.model("LogEntryLikes", logEntryLikesSchema);

module.exports = LogEntryLikes;
