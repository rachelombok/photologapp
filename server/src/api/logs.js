const { Router } = require("express");

const router = Router();
const LogEntry = require("../models/LogEntry");
const LogEntryLikes = require("../models/LogEntryLikes");
const upload = require("../services/file-upload");
const { requireAuth } = require("../controllers/authController");
//const singleUpload = upload.single("image");
const User = require("../models/User");
//const fs = require('fs');
//const path = require('path');
const {
  retrieveComments,
  createComment,
  deleteComment,
  toggleLike,
  retrieveLogEntryLikes,
  retrievePostFeed,
} = require("../controllers/logController");

router.get("/", async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    //populate commwents here
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/:logId/likes", requireAuth, toggleLike);
router.get("/:logId/likes", retrieveLogEntryLikes);

router.post("/:logId/comments", requireAuth, createComment);
router.get("/:logId/comments", retrieveComments);
router.delete("/:commentId/:logId/comments", requireAuth, deleteComment);

router.get("/feed/:offset", requireAuth, retrievePostFeed);

router.post(
  "/",
  requireAuth,
  upload.array("image", 5),
  async (req, res, next) => {
    try {
      const reqUser = req.user._id;
      let fileArray = req.files,
        fileLocation;

      const galleryImgLocationArray = [];
      for (let i = 0; i < fileArray.length; i++) {
        fileLocation = fileArray[i].location;
        galleryImgLocationArray.push(fileLocation);
      }
      const logEntry = new LogEntry({
        placeName: req.body.placeName,
        description: req.body.description,
        photographer: req.body.photographer,
        rating: req.body.rating,
        visitDate: req.body.visitDate,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image: galleryImgLocationArray,
        author: reqUser,
        tags: req.body.tags,
      });
      await User.findByIdAndUpdate(reqUser, {
        $push: { logs: logEntry._id },
        $inc: { logCount: 1 },
      });
      const logEntryLikes = new LogEntryLikes({
        logEntry: logEntry._id,
      });

      const createdEntry = await logEntry.save();
      await logEntryLikes.save();
      res.json(createdEntry);
    } catch (error) {
      if (error.name === "Validation Error") {
        res.status(422);
      }
      next(error);
    }
   
  }
);

module.exports = router;
