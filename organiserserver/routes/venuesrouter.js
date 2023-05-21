let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  uuidv4 = require('uuid/v4'),
  venuerouter = express.Router();
const DIR = './public/imagesOfVenues/';
const authenticate = require('../middleware/authenticate');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

// User model
let venuedb = require('../models/venuesSchema');
venuerouter.post(
  '/uploadVenueImages',
  upload.array('imgCollection', 6),
  (req, res, next) => {
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host');
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/public/imagesOfVenues/' + req.files[i].filename);
    }
    const user = new venuedb({
      imgCollection: reqFiles,
      organiser_Id: req.body.organiser_Id,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'Done upload!',
          userCreated: {
            imgCollection: result.imgCollection,
            organiser_Id: result.organiser_Id,
          },
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }
);

venuerouter.delete('/deleteVenuesPhotosByOrganiserId/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await venuedb.findByIdAndRemove({ _id: id });
    res.status(200).send('VenuePhotos Deleted successfully');
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

venuerouter.get('/viewAllDetails/:id', async (req, res) => {
  const organisersData = await venuedb
    .find({ organiser_Id: req.params.id })
    .populate('organiser_Id')
    .exec(function (err, organisersData) {
      if (err) console.log(err);
      res.json(organisersData);
    });
});

module.exports = venuerouter;
