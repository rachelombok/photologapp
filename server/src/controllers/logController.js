const Comment = require('../models/Comment');
const LogEntry = require('../models/LogEntry');
const socketHandler = require('../handlers/socketHandler');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs');
const crypto = require('crypto');
const upload = require("../services/file-upload");
const jwt = require('jsonwebtoken');
const {
  validateEmail,
  validateFullName,
  validateUsername,
  validateBio,
  validateWebsite,
} = require('../utils/validation');
const { request } = require('http');

// create comment, retrieve comments

module.exports.createComment = async (req, res, next) => {
  console.log("comment body", req.body);
    const { logId } = req.params;
    const { message } = req.body;
    const user = req.user;
    let logEntry = undefined;

    if (!message) {
      return res
        .status(400)
        .send({ error: 'Please provide a message with your comment.' });
    }
    if (!logId) {
      return res.status(400).send({
        error: 'Please provide the id of the post you would like to comment on.',
      });
    }

    try {
      logEntry = await LogEntry.findById(logId);
      if (!logEntry) {
        return res
          .status(404)
          .send({ error: 'Could not find a post with that post id.' });
      }
  
      const comment = new Comment({ author: user._id, logEntry: logId, message });
      await comment.save();

      logEntry.comments.push(comment._id);
      logEntry.commentsCount = logEntry.commentsCount + 1;
      await logEntry.save();

      res.status(201).send({
        ...comment.toObject(),
        author: { username: user.username, avatar: user.avatar },
        // commentVotes: [],
      });
    } catch (err) {
      next(err);
    }
}

module.exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  const user = req.user
  try {
    const comment = await Comment.findOne({
      _id: commentId,
      author: user._id,
    });
    if (!comment) {
      return res.status(404).send({
        error:
          'Could not find a comment with that id associated with the user.',
      });
    }

    const logEntry = await LogEntry.findById(req.params.logId);
    
  if (!logEntry) {
    return next({
      message: `No Log Entry found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  const index = logEntry.comments.indexOf(comment._id);
    logEntry.comments.splice(index, 1);
    logEntry.commentsCount = logEntry.commentsCount - 1;
  await logEntry.save();

    /*// This uses pre hooks to delete everything associated with this comment i.e replies
    const commentDelete = await Comment.deleteOne({
      _id: commentId,
    });
    if (!commentDelete.deletedCount) {
      return res.status(500).send({ error: 'Could not delete the comment.' });
    }*/
    const commentDelete = await Comment.deleteOne({
      _id: commentId,
    });
    if (!commentDelete.deletedCount) {
      return res.status(500).send({ error: 'Could not delete the comment.' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports.retrieveComments = async (req, res, next) => {
  const { logId } = req.params;
  try {
    //const comments = await retrieveComments(postId, offset, exclude);
    const comments = await Comment.find({ logEntry: logId }).populate({ path: 'author', select: 'username avatar'});
    console.log(comments);
    return res.send(comments);
  } catch (err) {
    next(err);
  }
};