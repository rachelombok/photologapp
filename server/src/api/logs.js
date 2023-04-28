const { Router } = require('express');

const router = Router();
const LogEntry = require('../models/LogEntry');
const upload = require("../services/file-upload");
//const singleUpload = upload.single("image");

//const fs = require('fs');
//const path = require('path');

router.get('/', async (req, res, next) => {
    try{
        const entries = await LogEntry.find();
        res.json(entries);
        
    } catch (error){
        next(error);
    }
    
});

router.post('/', upload.array("image", 5), async (req, res, next) => {
    try{
        console.log('files', req.files);
        let fileArray = req.files,fileLocation;
        console.log('filearray', fileArray);
        console.log(JSON.stringify(req.body));
        
        const galleryImgLocationArray = [];
		for ( let i = 0; i < fileArray.length; i++ ) {
			fileLocation = fileArray[ i ].location;
			console.log( 'filenm', fileLocation );
			galleryImgLocationArray.push( fileLocation )
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
            author: 'user',
            //image: req.file.location, 
        });
        console.log('bloop', logEntry);
        const createdEntry = await logEntry.save();
        console.log(createdEntry);
        //const createdEntry = await logentry.save();
        res.json(createdEntry);
    

    } catch (error){
        if (error.name === 'Validation Error'){
            res.status(422);        
        }
        console.log(`logs regular err: ${error}`);
        next(error);
    }
    /*const uid = req.params.id;
    let update;
    try {
        console.log("reqquest",req.body.longitude);
        singleUpload(req, res, function (err) {
            if (err) {
                console.log("errorupinhere");
              return res.json({
                success: false,
                errors: {
                  title: "Image Upload Error",
                  detail: err.message,
                  error: err,
                },
              });
            }
        update = req.file.location;
        console.log("this usupdate",update);
        
    });
    console.log("here?");
    const logEntry = LogEntry.create({
        placeName: req.body.placeName,
        description: req.body.description,
        image: update,
        rating: req.body.rating,
        visitDate: req.body.visitDate,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    });
    const createdEntry = await logEntry.save();
    //const createdEntry = await logentry.save();
    res.json(createdEntry);

    } catch (error){
        if (error.name === 'Validation Error'){
            res.status(422);        
        }
        console.log(`regular err: ${error.name}`);
        next(error);
    }*/
});
        //const logEntry = new LogEntry(req.body);
        //const createdEntry = await logEntry.save();
        //res.json(createdEntry);
        
        //const logEntry = new LogEntry(req.body);
        
        //res.json(createdEntry);
        /*,
        function(err, snap) {
            if (err) {
              res.render('error', { error: err });
              return;
            }
            
            res.json(snap);*/
        
        
        
      
    /*console.log(`file req${req}`);
    try {
        //const path = req.file.path;
        const obj = {
            title: req.body.title,
            description: req.body.description,
            comments: req.body.comments,
            image: req.file,
            rating: req.body.rating,
            visitDate: req.body.visitDate,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            //image: {
            //    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.image)),
            //    contentType: 'image/png'
            //}
        }
        const logEntry = new LogEntry(obj);
        const createdEntry = await logEntry.save();
        res.json(createdEntry);
        
    } catch (error) {
        if (error.name === 'Validation Error'){
            res.status(422);        
        }
        console.log(`regular err: ${error.name}`);
        next(error);

    }*/
    

/*
router.post('/image-upload', async (req, res) => {
    singleUpload(req, res, function (err) {
        if (err) {
          return res.status(422).send({ error: err.message });
        }
    
        res.json({ 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
     });
      });
    
});
*/
module.exports = router;