const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: "us-east-1",
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime type, only jpeg and png"), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: "test-travel-log-map",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TRAVEL_LOG_FILES" });
      // metadata or destination
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "/" + file.originalname);
      // key or filename
    },
  }),
});

module.exports = upload;
