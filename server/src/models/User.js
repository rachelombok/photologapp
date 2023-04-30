const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    fullname:{
        type: String,
        trim: true,
        required: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address.');
                }
        },
    },
    username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        minlength: 3,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        //maxlength: 20,
    },
    avatar: {
        type:String,
        default:'default.jpg',
    },
    bio: {
        type: String,
        maxlength: 130,
    },
    website: {
        type: String,
        maxlength: 65,
    },
    private: {
        type: Boolean,
        default: false,
    },
    insta: {
        type: String,
        maxlength: 30,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followersCount: {
        type: Number,
        default: 0,
      },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followingCount: {
        type: Number,
        default: 0,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    postCount: {
        type: Number,
        default: 0,
    },
    bookmarks: [
        { 
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
                },
        }
    ],
    //might be mongoose.Schema.ObjectId
    resetToken: String,
    expireToken: Date,
    
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (this.isNew) {
      try {
        const document = await User.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });
        if (document)
          return next(
            new RequestError(
              'A user with that email or username already exists.',
              400
            )
          );
        await mongoose.model('Followers').create({ user: this._id });
        await mongoose.model('Following').create({ user: this._id });
      } catch (err) {
        return next((err.statusCode = 400));
      }
    }
  });

const User = mongoose.model('User', userSchema);

module.exports = User;