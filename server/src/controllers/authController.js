const jwtSimple = require("jwt-simple");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const ConfirmationToken = require("../models/ConfirmationToken");
const bcrypt = require("bcrypt");
const axios = require("axios");

const {
  validateEmail,
  validateFullName,
  validateUsername,
  validatePassword,
} = require("../utils/validation");

module.exports.get = (req, res) => {
  res.json({
    message: "Hello Auth! 🔐",
  });
};

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

module.exports.verifyJwt = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = jwtSimple.decode(token, "j2390jf09kjsalkj4r93").id;
      const user = await User.findOne(
        { _id: id },
        "email username avatar bookmarks bio fullName confirmed website"
      );
      if (user) {
        return resolve(user);
      } else {
        reject("Not authorizedreject1.");
      }
    } catch (err) {
      return reject("Not authorizedreject2.");
    }
  });
};

module.exports.requireAuth = async (req, res, next) => {
  let token;

  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).send({ error: "Not authorized login." });
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next({
      message: "You need to be logged in to visit this route",
      statusCode: 403,
    });
  }
  try {
    const decoded = jwt.verify(token, "shhhhh");
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return next({ message: `No user found for ID ${decoded._id}` });
    }
    res.locals.user = user;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: `New error: ${err}` });
  }
};

module.exports.optionalAuth = async (req, res, next) => {
  // fix this func
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  if (authorization) {
    try {
      const decoded = jwt.verify(token, "shhhhh");
      const user = await User.findById(decoded._id).select("-password");
      if (!user) {
        return next({ message: `No user found for ID ${decoded._id}` });
      }
      // Allow other middlewares to access the authenticated user details.
      res.locals.user = user;
      req.user = user;
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }
  return next();
};

module.exports.loginAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const { usernameOrEmail, password } = req.body;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      return res.send({
        user,
        token: authorization,
      });
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }

  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .send({ error: "Please provide both a username/email and a password." });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user || !user.password) {
      return res.status(401).send({
        error: "The credentials you provided are incorrect, please try again.",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.status(401).send({
          error:
            "The credentials you provided are incorrect, please try again.",
        });
      }
      createTokenSendResponse(user, res, next);
    });
  } catch (err) {
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  const { username, fullname, email, password } = req.body;
  let user = null;
  let confirmationToken = null;

  const usernameError = validateUsername(username);
  if (usernameError) return res.status(400).send({ error: usernameError });

  const fullNameError = validateFullName(fullname);
  if (fullNameError) return res.status(400).send({ error: fullNameError });

  const emailError = validateEmail(email);
  if (emailError) return res.status(400).send({ error: emailError });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).send({ error: passwordError });

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    user = new User({ fullname, email, username, password: hashPassword });
    confirmationToken = new ConfirmationToken({
      user: user._id,
      token: crypto.randomBytes(20).toString("hex"),
    });
    await user.save();
    await confirmationToken.save();
    createTokenSendResponse(user, res, next);
  } catch (err) {
    next(err.message);
  }
};

module.exports.githubLoginAuthentication = async (req, res, next) => {
  const { code, state } = req.body;
  if (!code || !state) {
    return res
      .status(400)
      .send({ error: "Please provide a github access code and state." });
  }

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        state,
      }
    );
    const accessToken = response.data.split("&")[0].split("=")[1];

    // Retrieve the user's info
    const githubUser = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    // Retrieve the user's email addresses
    // Private emails are not provided in the previous request
    const emails = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const primaryEmail = emails.data.find((email) => email.primary).email;

    const userDocument = await User.findOne({ githubId: githubUser.data.id });
    if (userDocument) {
      return res.send({
        user: {
          _id: userDocument._id,
          email: userDocument.email,
          username: userDocument.username,
          avatar: userDocument.avatar,
          bookmarks: userDocument.bookmarks,
        },
        token: jwtSimple.encode(
          { id: userDocument._id },
          process.env.JWT_SECRET
        ),
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: primaryEmail }, { username: githubUser.data.login }],
    });

    if (existingUser) {
      if (existingUser.email === primaryEmail) {
        return res.status(400).send({
          error:
            "A user with the same email already exists, please change your primary github email.",
        });
      }
    }

    const user = new User({
      email: primaryEmail,
      fullName: githubUser.data.name,
      username: githubUser.data.login,
      githubId: githubUser.data.id,
      avatar: githubUser.data.avatar_url,
    });

    await user.save();
    return res.send({
      user: {
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bookmarks: user.bookmarks,
      },
      token: jwtSimple.encode({ id: user._id }, process.env.JWT_SECRET),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  let currentPassword = undefined;

  try {
    const userDocument = await User.findById(user._id);
    currentPassword = userDocument.password;

    const result = await bcrypt.compare(oldPassword, currentPassword);
    if (!result) {
      return res.status(401).send({
        error: "Your old password was entered incorrectly, please try again.",
      });
    }

    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError)
      return res.status(400).send({ error: newPasswordError });
    const hashPassword = await bcrypt.hash(newPassword, 10);
    userDocument.password = hashPassword;
    await userDocument.save();
    return res.send();
  } catch (err) {
    return next(err);
  }
};

module.exports.me = async (req, res, next) => {
  const { avatar, username, fullname, email, _id, website, bio } = req.user;
  res.status(200).json({
    success: true,
    data: { avatar, username, fullname, email, _id, website, bio },
  });
};
