const { Router } = require('express');

const router = Router();
const User = require('../models/User');
const upload = require("../services/file-upload");

const {
    retrieveUser,
    retrievePosts,
    bookmarkPost,
    followUser,
    retrieveFollowing,
    retrieveFollowers,
    searchUsers,
    confirmUser,
    changeAvatar,
    removeAvatar,
    updateProfile,
    retrieveSuggestedUsers,
  } = require('../controllers/userController');
const { requireAuth, optionalAuth } = require('../controllers/authController');


router.get('/suggested/:max?', requireAuth, retrieveSuggestedUsers);
router.get('/:username', optionalAuth, retrieveUser);
router.get('/:username/posts/:offset', retrievePosts);
router.get('/:userId/:offset/following', requireAuth, retrieveFollowing);
router.get('/:userId/:offset/followers', requireAuth, retrieveFollowers);
router.get('/:username/:offset/search', searchUsers);

router.put('/confirm', requireAuth, confirmUser);
router.patch('/avatar', requireAuth, upload.single("image"), changeAvatar);
router.patch('/edit', requireAuth, updateProfile);

router.delete('/avatar', optionalAuth, removeAvatar);

router.post('/:postId/bookmark', requireAuth, bookmarkPost);
router.post('/:userId/follow', requireAuth, followUser);

module.exports = router;

