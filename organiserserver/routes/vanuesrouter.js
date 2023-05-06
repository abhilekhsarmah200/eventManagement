let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  uuidv4 = require('uuid/v4'),
  router = express.Router();
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
const userdb = require('../models/userSchema');
// User model
let vanuedb = require('../models/venuesSchema');
router.post(
  '/uploadVanueImages',
  upload.array('imgCollection', 6),
  (req, res, next) => {
    const reqFiles = [];
    let { userId } = req.body;
    const url = req.protocol + '://' + req.get('host');
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/public/imagesOfVanues/' + req.files[i].filename);
    }
    const user = new vanuedb({
      _id: new mongoose.Types.ObjectId(),
      imgCollection: reqFiles,
      userId: userId,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'Done upload!',
          userCreated: {
            _id: result._id,
            imgCollection: result.imgCollection,
            userId: result.userId,
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

// router.get('/vanuephotos', authenticate, async (req, res) => {
//   try {
//     const users = await vanuedb.findOne({userId:req.userId});
//     const ValidUserOne = await userdb.findOne({ _id: req.userId });
//     if(ValidUserOne==users)
//     res.status(201).json({
//       status: 201,
//       message: 'User list retrieved successfully!',
//       users: users,
//     });
//   } catch (error) {
//     res.status(401).json({ status: 401, error });
//   }
// });

router.get('/vanuephotos', (req, res, next) => {
  vanuedb.find().then((data) => {
    res.status(200).json({
      message: 'User list retrieved successfully!',
      users: data,
    });
  });
});
module.exports = router;
