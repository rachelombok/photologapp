const Comment = require('../models/Comment');
const LogEntry = require('../models/LogEntry');
const LogEntryLikes = require('../models/LogEntryLikes');
const Following = require('../models/Following');
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
// toggle like, get likes

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

module.exports.toggleLike = async (req, res, next) => {
  const { logId } = req.params;
  const user = req.user;

  try{
    const logEntry = await LogEntry.findById(logId);
    if (!logEntry) {
      return next({
        message: `No post found for id ${logId}`,
        statusCode: 404,
      });
    }
    // Update the vote array if the user has not already liked the post
    const logEntryLikeUpdate = await LogEntryLikes.updateOne(
      { logEntry: logId, 'likes.author': { $ne: user._id } },
      {
        $push: { likes: { author: user._id } },
      }
    );
    if (!logEntryLikeUpdate.nModified) {
      if (!logEntryLikeUpdate.ok) {
        return res.status(500).send({ error: 'Could not vote on the post. :(' });
      }
      // Nothing was modified in the previous query meaning that the user has already liked the post
      // Remove the user's like
      const logEntryDislikeUpdate = await LogEntryLikes.updateOne(
        { logEntry: logId },
        { $pull: { likes: { author: user._id } } }
      );

      if (!logEntryDislikeUpdate.nModified) {
        return res.status(500).send({ error: 'Could not vote on the post. :)' });
      }
    }
    
    if (logEntry.likes.includes(req.user._id)) {
      const index = logEntry.likes.indexOf(req.user._id);
      logEntry.likes.splice(index, 1);
      logEntry.likesCount = logEntry.likesCount - 1;
      await logEntry.save();
    } else {
      logEntry.likes.push(req.user._id);
      logEntry.likesCount = logEntry.likesCount + 1;
      await logEntry.save();
    }
    return res.send({ success: true });
  } catch(e){
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

module.exports.retrieveLogEntryLikes = async (req, res, next) => {
  const { logId } = req.params;
  try {
    //const comments = await retrieveComments(postId, offset, exclude);
    const likes = await LogEntryLikes.findOne({ logEntry: logId }).populate({ path: 'likes.author', select: 'username avatar'});
    return res.send(likes?.likes);
  } catch (err) {
    next(err);
  }
};

module.exports.retrievePostFeed = async (req, res, next) => {
  const user = req.user
  const { offset } = req.params;

  try {
    const followingDocument = await Following.findOne({ user: user._id });
    if (!followingDocument) {
      return res.status(404).send({ error: 'Could not find any posts.' });
    }
    const following = followingDocument.following.map(
      (following) => following.user
    );

    const feedPosts = await LogEntry.find({ author: { $in: following}}).sort({createdAt: -1});
      return res.send(feedPosts);
  } catch (e){
    next(err);
  }
}