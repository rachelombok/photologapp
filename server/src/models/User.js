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
        minlength: 8,
        maxlength: 20,
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
    /*followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
    },*/
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

const User = mongoose.model('User', userSchema);

module.exports = User;