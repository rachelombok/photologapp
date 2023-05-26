const User = require("../models/User");
const Post = require("../models/LogEntry");
const Followers = require("../models/Followers");
const Following = require("../models/Following");
const ConfirmationToken = require("../models/ConfirmationToken");
const Notification = require("../models/Notification");
const socketHandler = require("../handlers/socketHandler");
const ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs");
const crypto = require("crypto");
const upload = require("../services/file-upload");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateFullName,
  validateUsername,
  validateBio,
  validateWebsite,
} = require("../utils/validation");
const { request } = require("http");
//const { sendConfirmationEmail } = require('../utils/controllerUtils');

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    fullname: user.fullname,
    avatar: user.avatar,
    website: user.website,
    bio: user.bio,
  };
  const token = jwt.sign(payload, "shhhhh", { expiresIn: "7d" });
  return res.json({
    success: true,
    token: token,
    user: payload,
  });
};

module.exports.retrieveUser = async (req, res, next) => {
  const { username } = req.params;
  const requestingUser = req.user;
  //console.log('req user', res, req);
  try {
    const user = await User.findOne(
      { username },
      "username fullname avatar bio fullname _id logCount website followingCount followersCount"
    ).populate({
      path: "logs",
      select:
        "image thumbnail rating timestamp author placeName description photographer tags visitDate createdAt latitude longitude",
      options: { sort: { createdAt: -1 } },
    });
    if (!user) {
      return res
        .status(404)
        .send({ error: "Could not find a user with that username." });
    }
    console.log(user);
    /*const posts = await Post.aggregate([
      {
        $facet: {
          data: [
            { $match: { author: ObjectId(user._id) } },
            { $sort: { date: -1 } },
            { $limit: 12 },
            {
              $lookup: {
                from: 'postvotes',
                localField: '_id',
                foreignField: 'post',
                as: 'postvotes',
              },
            },
            {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post',
                as: 'comments',
              },
            },
            {
              $lookup: {
                from: 'commentreplies',
                localField: 'comments._id',
                foreignField: 'parentComment',
                as: 'commentReplies',
              },
            },
            {
              $unwind: '$postvotes',
            },
            {
              $addFields: { image: '$thumbnail' },
            },
            {
              $project: {
                user: true,
                followers: true,
                following: true,
                comments: {
                  $sum: [{ $size: '$comments' }, { $size: '$commentReplies' }],
                },
                image: true,
                thumbnail: true,
                filter: true,
                caption: true,
                author: true,
                postVotes: { $size: '$postvotes.votes' },
              },
            },
          ],
          postCount: [
            { $match: { author: ObjectId(user._id) } },
            { $count: 'postCount' },
          ],
        },
      },
      { $unwind: '$postCount' },
      {
        $project: {
          data: true,
          postCount: '$postCount.postCount',
        },
      },
    ]);*/

    const followersDocument = await Followers.findOne({
      user: ObjectId(user._id),
    });

    const followingDocument = await Following.findOne({
      user: ObjectId(user._id),
    });

    //user.isMe = req.user.id === user._id.toString();
    console.log(
      `getting following for ${user.fullname}`,
      followersDocument.followers,
      followingDocument.following
    );
    user.isMe = res.locals.user === user._id.toString();
    //user.followingLength =followingDocument.following?.length;
    //user.followerLength = followersDocument.followers?.length;
    user.isFollowing = requestingUser
      ? !!followersDocument.followers?.find(
          (follower) => String(follower.user) === String(requestingUser._id)
        )
      : false;
    console.log("is following in retirve ia", user.isFollowing, requestingUser);
    // user if profile
    /*user.isFollowing = requestingUser
    ? !!followersDocument.followers.find(
        (follower) => String(follower.user) === String(requestingUser._id)
      )
    : false;*/
    return res.send({
      user,
      followers: followersDocument.followers?.length,
      following: followingDocument.following?.length,
      // Check if the requesting user follows the retrieved user
      isFollowing: requestingUser
        ? !!followersDocument.followers?.find(
            (follower) => String(follower.user) === String(requestingUser._id)
          )
        : false,
      //posts: posts[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports.retrievePosts = async (req, res, next) => {
  // Retrieve a user's posts with the post's comments & likes
  const { username, offset = 0 } = req.params;
  try {
    const posts = await Post.aggregate([
      { $sort: { date: -1 } },
      { $skip: Number(offset) },
      { $limit: 12 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "user",
        },
      },
      { $match: { "user.username": username } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "postvotes",
          localField: "_id",
          foreignField: "post",
          as: "postVotes",
        },
      },
      { $unwind: "$postVotes" },
      {
        $project: {
          image: true,
          caption: true,
          date: true,
          "user.username": true,
          "user.avatar": true,
          comments: { $size: "$comments" },
          postVotes: { $size: "$postVotes.votes" },
        },
      },
    ]);
    if (posts.length === 0) {
      return res.status(404).send({ error: "Could not find any posts." });
    }
    return res.send(posts);
  } catch (err) {
    next(err);
  }
};

module.exports.bookmarkPost = async (req, res, next) => {
  const { postId } = req.params;
  const user = res.locals.user;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .send({ error: "Could not find a post with that id." });
    }

    const userBookmarkUpdate = await User.updateOne(
      {
        _id: user._id,
        "bookmarks.post": { $ne: postId },
      },
      { $push: { bookmarks: { post: postId } } }
    );
    if (!userBookmarkUpdate.nModified) {
      if (!userBookmarkUpdate.ok) {
        return res.status(500).send({ error: "Could not bookmark the post." });
      }
      // The above query did not modify anything meaning that the user has already bookmarked the post
      // Remove the bookmark instead
      const userRemoveBookmarkUpdate = await User.updateOne(
        { _id: user._id },
        { $pull: { bookmarks: { post: postId } } }
      );
      if (!userRemoveBookmarkUpdate.nModified) {
        return res.status(500).send({ error: "Could not bookmark the post." });
      }
      return res.send({ success: true, operation: "remove" });
    }
    return res.send({ success: true, operation: "add" });
  } catch (err) {
    next(err);
  }
};

module.exports.followUser = async (req, res, next) => {
  console.log("starting to follow user");

  const { userId } = req.params; // id of user we are trying to follow
  const user = res.locals.user; // id of user making the request

  try {
    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
      return res
        .status(400)
        .send({ error: "Could not find a user with that id." });
    }
    console.log(
      `${user.fullname} is trying to follow ${userToFollow.fullname}`
    );
    // rachel follows someonelese
    // rachel = user._id
    //someoneelse = userId
    const followerUpdate = await Followers.updateOne(
      { user: userId, "followers.user": { $ne: user._id } },
      { $push: { followers: { user: user._id } } }
    ); // add Rachel to someoneleses followers 'list'

    const followingUpdate = await Following.updateOne(
      { user: user._id, "following.user": { $ne: userId } },
      { $push: { following: { user: userId } } }
    );
    // add someone else to Rachels following 'list

    if (!followerUpdate.nModified || !followingUpdate.nModified) {
      if (!followerUpdate.ok || !followingUpdate.ok) {
        return res
          .status(500)
          .send({ error: "Could not follow user please try again later." });
      }
      // Nothing was modified in the above query meaning that the user is already following
      // Unfollow instead

      // Rachel = user._id,
      const followerUnfollowUpdate = await Followers.updateOne(
        {
          user: userId,
        },
        { $pull: { followers: { user: user._id } } }
      ); // remove Rachel from someone else followers list

      const followingUnfollowUpdate = await Following.updateOne(
        { user: user._id },
        { $pull: { following: { user: userId } } }
      ); // remove someone else from Rachels following list
      if (!followerUnfollowUpdate.ok || !followingUnfollowUpdate.ok) {
        return res
          .status(500)
          .send({ error: "Could not follow user please try again later." });
      }
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: user._id },
        $inc: { followersCount: -1 },
      });
      await User.findByIdAndUpdate(user._id, {
        $pull: { following: userId },
        $inc: { followingCount: -1 },
      });

      return res.send({ success: true, operation: "unfollow" });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { followers: user._id },
      $inc: { followersCount: 1 },
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { following: userId },
      $inc: { followingCount: 1 },
    });
    /* const notification = new Notification({
      notificationType: 'follow',
      sender: user._id,
      receiver: userId,
      date: Date.now(),
    });

    const sender = await User.findById(user._id, 'username avatar');
    const isFollowing = await Following.findOne({
      user: userId,
      'following.user': user._id,
    });

    await notification.save();
    socketHandler.sendNotification(req, {
      notificationType: 'follow',
      sender: {
        _id: sender._id,
        username: sender.username,
        avatar: sender.avatar,
      },
      receiver: userId,
      date: notification.date,
      isFollowing: !!isFollowing,
    });*/

    res.send({ success: true, operation: "follow" });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves either who a specific user follows or who is following the user.
 * Also retrieves whether the requesting user is following the returned users
 * @function retrieveRelatedUsers
 * @param {object} user The user object passed on from other middlewares
 * @param {string} userId Id of the user to be used in the query
 * @param {number} offset The offset for how many documents to skip
 * @param {boolean} followers Whether to query who is following the user or who the user follows default is the latter
 * @returns {array} Array of users
 */
const retrieveRelatedUsers = async (user, userId, offset, followers) => {
  const reqUserFollowing = await Following.findOne(
    { user: user._id },
    "user following"
  );
  if (followers) {
    const followersDocument = await Followers.findOne(
      { user: userId },
      "user followers"
    ).populate({
      path: "followers.user",
      select: "username avatar fullname isFollowing",
    });
    //console.log(followersDocument, reqUserFollowing.following);
    const followersList = { user: followersDocument.user, users: [] };
    followersDocument.followers.forEach((followerUser) => {
      // if followed userid is in my following list, isfollowing is true
      followerUser.user.isFollowing = false;
      if (
        reqUserFollowing.following.find(
          (follower) => String(follower.user) == String(followerUser.user._id)
        )
      ) {
        followerUser.user.isFollowing = true;
      }
      followersList.users.push({
        user: {
          _id: followerUser.user._id,
          username: followerUser.user.username,
          isFollowing: followerUser.user.isFollowing,
          avatar: followerUser.user.avatar,
          fullname: followerUser.user.fullname,
        },
      });
    });
    return followersList;
  } else {
    const followingDocument = await Following.findOne(
      { user: userId },
      "user following"
    ).populate({
      path: "following.user",
      select: "username avatar fullname isFollowing",
    });
    console.log(
      "following doc",
      followingDocument,
      userId,
      followingDocument.following
    );
    const followingList = { user: followingDocument.user, users: [] };
    followingDocument.following.forEach((followingUser) => {
      // if followed userid is in my following list, isfollowing is true
      followingUser.user.isFollowing = false;
      if (
        reqUserFollowing.following.find(
          (follower) => String(follower.user) == String(followingUser.user._id)
        )
      ) {
        followingUser.user.isFollowing = true;
      }
      followingList.users.push({
        user: {
          _id: followingUser.user._id,
          username: followingUser.user.username,
          isFollowing: followingUser.user.isFollowing,
          avatar: followingUser.user.avatar,
          fullname: followingUser.user.fullname,
        },
      });
    });
    return followingList;
  }

  //ollowersDocument.justbc = "YPE";
  // user.isFollowing = requestingUser ? !!followersDocument.followers?.find((follower) => String(follower.user) === String(requestingUser._id)) : false;

  /*if (followers){
    console.log('we are looking for dollowers', userId);
    //const followersList = await Followers.findOne({ userId }, 'user');
    const followersDocument = await Followers.findOne(
      { user: userId },
      'user followers'
    ).populate({ path: 'followers', populate: {
      path: 'user',
      select: 'fullname avatar username'
    } });
    if (!followersDocument) {
      console.log('empty list', followersDocument);
      return;
    }
    console.log('did i find the follow list?', followersDocument.followers);
    const followedUsers = new Set();
    // user.isFollowing = requestingUser ? !!followersDocument.followers?.find((follower) => String(follower.user) === String(requestingUser._id)) : false;
    
    followersDocument.followers.forEach((followerUser)=>{
      followerUser.isFollowing = false;
      // console.log(followerUser.user._id, usr)
      if(String(followerUser.user._id) === String(user._id)) {
        followerUser.isFollowing = true;
      }
      console.log('add the field?',user, followerUser);
    });
    return followersDocument;
  }
  else {
    const followinggDocument = await Following.findOne(
      { user: userId },
      'user following'
    ).populate({ path: 'following', populate: {
      path: 'user',
      select: 'fullname avatar username'
    } });
  }*/

  /*const pipeline = [
    {
      $match: { user: ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'users',
        let: followers
          ? { userId: '$followers.user' }
          : { userId: '$following.user' },
        pipeline: [
          {
            $match: {
              // Using the $in operator instead of the $eq
              // operator because we can't coerce the types
              $expr: { $in: ['$_id', '$$userId'] },
            },
          },
          {
            $skip: Number(offset),
          },
          {
            $limit: 10,
          },
        ],
        as: 'users',
      },
    },
    {
      $lookup: {
        from: 'followers',
        localField: 'user._id',
        foreignField: 'user',
        as: 'userFollowers',
      },
    },
    {
      $project: {
        'users._id': true,
        'users.username': true,
        'users.avatar': true,
        userFollowers: true,
      },
    },
  ];


  const aggregation = followers
    ? await Followers.aggregate(pipeline)
    : await Following.aggregate(pipeline);
  console.log('aggie', aggregation[0].users);
  // Make a set to store the IDs of the followed users
  const followedUsers = new Set();
  // Loop through every follower and add the id to the set if the user's id is in the array
  aggregation[0].userFollowers.forEach((followingUser) => {
    if (
      !!followingUser.followers.find(
        (follower) => String(follower.user) === String(user._id)
      )
    ) {
      followedUsers.add(String(followingUser.user));
    }
  });
  // Add the isFollowing key to the following object with a value
  // depending on the outcome of the loop above
  aggregation[0].users.forEach((followingUser) => {
    followingUser.isFollowing = followedUsers.has(String(followingUser._id));
  });
console.log('getting followerspls', aggregation, followedUsers);
  return aggregation[0].users;*/
};

module.exports.retrieveFollowing = async (req, res, next) => {
  const { userId, offset = 0 } = req.params;
  const user = res.locals.user;
  try {
    const users = await retrieveRelatedUsers(user, userId, offset, false);
    return res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.retrieveFollowers = async (req, res, next) => {
  const { userId, offset = 0 } = req.params;
  const user = req.user;

  try {
    const users = await retrieveRelatedUsers(user, userId, offset, true);
    return res.send(users);
  } catch (err) {
    console.log("we failed here11");
    next(err);
  }
};

module.exports.searchUsers = async (req, res, next) => {
  const { username, offset = 0 } = req.params;
  if (!username) {
    return res
      .status(400)
      .send({ error: "Please provide a user to search for." });
  }

  try {
    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: new RegExp(username), $options: "i" },
        },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "user",
          as: "followers",
        },
      },
      {
        $unwind: "$followers",
      },
      {
        $addFields: {
          followersCount: { $size: "$followers.followers" },
        },
      },
      {
        $sort: { followersCount: -1 },
      },
      {
        $skip: Number(offset),
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: true,
          username: true,
          avatar: true,
          fullName: true,
        },
      },
    ]);
    if (users.length === 0) {
      return res
        .status(404)
        .send({ error: "Could not find any users matching the criteria." });
    }
    return res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.confirmUser = async (req, res, next) => {
  const { token } = req.body;
  const user = res.locals.user;

  try {
    const confirmationToken = await ConfirmationToken.findOne({
      token,
      user: user._id,
    });
    if (!confirmationToken) {
      return res
        .status(404)
        .send({ error: "Invalid or expired confirmation link." });
    }
    await ConfirmationToken.deleteOne({ token, user: user._id });
    await User.updateOne({ _id: user._id }, { confirmed: true });
    return res.send();
  } catch (err) {
    next(err);
  }
};

module.exports.changeAvatar = async (req, res, next) => {
  const user = res.locals.user;

  if (!req.file) {
    return res
      .status(400)
      .send({ error: "Please provide the image to upload." });
  }
  console.log("changing avatar", req.file);
  try {
    await User.findByIdAndUpdate(req.user._id, {
      avatar: req.file.location,
    });
    res.send([req.file.location]);
  } catch (e) {
    return res
      .status(404)
      .send({ error: "Trouble updating your picture, try again later" });
  }

  /*cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const response = await cloudinary.uploader.upload(req.file.path, {
      width: 200,
      height: 200,
      gravity: 'face',
      crop: 'thumb',
    });
    fs.unlinkSync(req.file.path);

    const avatarUpdate = await User.updateOne(
      { _id: user._id },
      { avatar: response.secure_url }
    );

    if (!avatarUpdate.nModified) {
      throw new Error('Could not update user avatar.');
    }

    return res.send({ avatar: response.secure_url });
  } catch (err) {
    next(err);
  }*/
};

module.exports.removeAvatar = async (req, res, next) => {
  const user = res.locals.user;

  try {
    const avatarUpdate = await User.updateOne(
      { _id: user._id },
      { $unset: { avatar: "" } }
    );
    if (!avatarUpdate.nModified) {
      next(err);
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const user = res.locals.user;
  const { fullName, username, website, bio, email } = req.body;
  console.log(
    "this is what we are updateing",
    fullName,
    username,
    website,
    bio,
    email
  );
  let confirmationToken = undefined;
  let updatedFields = {};
  try {
    const userDocument = await User.findOne({ _id: user._id });

    if (fullName) {
      const fullNameError = validateFullName(fullName);
      if (fullNameError) return res.status(400).send({ error: fullNameError });
      userDocument.fullName = fullName;
      updatedFields.fullName = fullName;
    }

    if (username) {
      const usernameError = validateUsername(username);
      if (usernameError) return res.status(400).send({ error: usernameError });
      // Make sure the username to update to is not the current one
      if (username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser)
          return res
            .status(400)
            .send({ error: "Please choose another username." });
        userDocument.username = username;
        updatedFields.username = username;
      }
    }

    if (website) {
      const websiteError = validateWebsite(website);
      if (websiteError) return res.status(400).send({ error: websiteError });
      if (!website.includes("http://") && !website.includes("https://")) {
        userDocument.website = "https://" + website;
        updatedFields.website = "https://" + website;
      } else {
        userDocument.website = website;
        updatedFields.website = website;
      }
    }

    if (bio) {
      const bioError = validateBio(bio);
      if (bioError) return res.status(400).send({ error: bioError });
      userDocument.bio = bio;
      updatedFields.bio = bio;
    }

    if (email) {
      const emailError = validateEmail(email);
      if (emailError) return res.status(400).send({ error: emailError });
      // Make sure the email to update to is not the current one
      if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser)
          return res
            .status(400)
            .send({ error: "Please choose another email." });
        confirmationToken = new ConfirmationToken({
          user: user._id,
          token: crypto.randomBytes(20).toString("hex"),
        });
        await confirmationToken.save();
        userDocument.email = email;
        userDocument.confirmed = false;
        updatedFields = { ...updatedFields, email, confirmed: false };
      }
    }
    console.log(updatedFields);
    const updatedUser = await userDocument.save();
    createTokenSendResponse(updatedUser, res, next);
    /*if (email && email !== user.email) {
      sendConfirmationEmail(
        updatedUser.username,
        updatedUser.email,
        confirmationToken.token
      );
    }*/
  } catch (err) {
    next(err);
  }
};

module.exports.retrieveSuggestedUsers = async (req, res, next) => {
  const { max } = req.params;
  const user = res.locals.user;
  try {
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: ObjectId(user._id) } },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "user",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "posts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$author", "$$userId"],
                },
              },
            },
            {
              $sort: { date: -1 },
            },
            {
              $limit: 3,
            },
          ],
          as: "posts",
        },
      },
      {
        $unwind: "$followers",
      },
      {
        $project: {
          username: true,
          fullName: true,
          email: true,
          avatar: true,
          isFollowing: { $in: [user._id, "$followers.followers.user"] },
          posts: true,
        },
      },
      {
        $match: { isFollowing: false },
      },
      {
        $sample: { size: max ? Number(max) : 20 },
      },
      {
        $sort: { posts: -1 },
      },
      {
        $unset: ["isFollowing"],
      },
    ]);
    res.send(users);
  } catch (err) {
    next(err);
  }
};
