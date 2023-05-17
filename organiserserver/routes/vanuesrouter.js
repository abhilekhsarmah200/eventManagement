let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  uuidv4 = require('uuid/v4'),
  vanuerouter = express.Router();
const DIR = './public/imagesOfVanues/';
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
let vanuedb = require('../models/venuesSchema');
vanuerouter.post(
  '/uploadVanueImages',
  upload.array('imgCollection', 6),
  (req, res, next) => {
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host');
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/public/imagesOfVanues/' + req.files[i].filename);
    }
    const user = new vanuedb({
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

vanuerouter.delete('/deleteVanuesPhotosByOrganiserId/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await vanuedb.findByIdAndRemove({ _id: id });
    res.status(200).send('VanuePhotos Deleted successfully');
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

vanuerouter.get('/viewAllDetails/:id', async (req, res) => {
  const organisersData = await vanuedb
    .find({ organiser_Id: req.params.id })
    .populate('organiser_Id')
    .exec(function (err, organisersData) {
      if (err) console.log(err);
      res.json(organisersData);
    });
});

module.exports = vanuerouter;
