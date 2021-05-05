 
const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredNumber = {
    type: Number,
    required: true,
  };
  
const logEntrySchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  placeName: {
        type: String,
        required: true,
      },
  description: String,
  photographer: String,
  image: {type: Array},
  thumbnail: String,
  tags: [{
      type: String,
      lowercase: true,
  }],
  rating: {
      type: Number,
          min: 0,
          max: 10,
          default: 0,
        },
  latitude: {
        ...requiredNumber,
        min: -90,
        max: 90,
      },
  longitude: {
        ...requiredNumber,
        min: -180,
        max: 180,
      },
  visitDate: {
        required: true,
        type: Date,
      },
  /*likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: {
    type: Number,
    default: 0,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  commentsCount: {
    type: Number,
    default: 0,
  },*/
      
}, {
  timestamps: true,
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;