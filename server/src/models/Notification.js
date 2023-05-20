const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notificationType: {
        type: String,
        enum: ['follow', 'like', 'comment', 'mention'],
    },
    notificationData: Object,
    read: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
/**
 * Sends a notification when a user has commented on your post
 * @function sendCommentNotification
 * @param {object} req The request object
 * @param {object} sender User who triggered the notification
 * @param {string} receiver Id of the user to receive the notification
 * @param {string} image Image of the post that was commented on
 * @param {string} filter The filter applied to the image
 * @param {string} message The message sent by the user
 * @param {string} postId The id of the post that was commented on
 */