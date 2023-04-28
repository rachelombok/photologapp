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
router.put('/avatar', requireAuth, 
  upload.array("image", 5), async (req, res, next) => {
    try{
        let fileArray = req.files,fileLocation;
        console.log(req.files);
        console.log(JSON.stringify(req.body));
        
        const galleryImgLocationArray = [];
		for ( let i = 0; i < fileArray.length; i++ ) {
			fileLocation = fileArray[ i ].location;
			console.log( 'filenm', fileLocation );
			galleryImgLocationArray.push( fileLocation )
		}
        /*const logEntry = new LogEntry({
            placeName: req.body.placeName,
            description: req.body.description,
            photographer: req.body.photographer,
            rating: req.body.rating,
            visitDate: req.body.visitDate,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            image: galleryImgLocationArray,
            //image: req.file.location, 
        });*/
        //console.log('bloop', logEntry);
        //const createdEntry = await logEntry.save();
        //console.log(createdEntry);
        //const createdEntry = await logentry.save();
        //res.json(createdEntry);
    

    } catch (error){
        if (error.name === 'Validation Error'){
            res.status(422);        
        }
        console.log(`user regular err: ${error.name}`);
        next(error);
    } },
  changeAvatar
);
router.put('/', requireAuth, updateProfile);

router.delete('/avatar', requireAuth, removeAvatar);

router.post('/:postId/bookmark', requireAuth, bookmarkPost);
router.post('/:userId/follow', requireAuth, followUser);

module.exports = router;

