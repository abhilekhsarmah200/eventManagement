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
let organiserdb = require('../models/userSchema');
// User model
let vanuedb = require('../models/venuesSchema');
vanuerouter.post(
  '/uploadVanueImages',
  upload.array('imgCollection', 6),
  (req, res, next) => {
    const reqFiles = [];
    let { userId } = req.body;
    const url = req.protocol + '://' + req.get('host');
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/public/imagesOfVanues/' + req.files[i].filename);
    }
    const user = new organiserdb({
      imgCollection: reqFiles,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'Done upload!',
          userCreated: {
            imgCollection: result.imgCollection,
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

// vanuerouter.get('/vanuephotos', authenticate, async (req, res) => {
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

// vanuerouter.get('/vanuephotos/:id', async (req, res, next) => {
//   try {
//     const { _id, userId } = req.body;
//     const ValidUserOne = await userdb.findOne({ id: _id });
//     const ValidVanueUserId = await vanuedb.findOne({ userId: userId });
//     const isMatch = await compare(ValidUserOne, ValidVanueUserId);
//     if (isMatch) {
//       vanuedb.find().then((data) => {
//         res.status(200).json({
//           message: 'vanue Photos retrieved successfully!',
//           users: data,
//         });
//       });
//     }
//   } catch (error) {
//     res.status(401).json({ status: 401, error });
//   }
// });

// vanuerouter.get('/vanuephotos/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const users = await vanuedb.findById(id);
//     res.status(200).send(users);
//   } catch (error) {
//     res.status(404).json({ message: error.stack });
//   }
// });

// vanuerouter.get('/:id', function (req, res) {
//   Events.find({ organizer: req.params.id })
//     .populate({
//       path: 'attendees',
//       populate: { path: 'attendees' },
//     })
//     .exec(function (err, events) {
//       if (err) console.log(err);
//       res.json(events);
//     });
// });

vanuerouter.get('/vanuephotos', (req, res, next) => {
  organiserdb.find().then((data) => {
    res.status(200).json({
      message: 'User list retrieved successfully!',
      users: data,
    });
  });
});

module.exports = vanuerouter;
