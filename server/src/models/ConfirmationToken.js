const mongoose = require("mongoose");

const { Schema } = mongoose;

const confirmationTokenSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: String,
});

const ConfirmationToken = mongoose.model(
  "ConfirmationToken",
  confirmationTokenSchema
);

module.exports = ConfirmationToken;
