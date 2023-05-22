const express = require('express');
const router = new express.Router();
const organiserdb = require('../models/userSchema');
var bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bookingdb = require('../models/Booking');

const keysecret = process.env.SECRET_KEY;

// email config

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Image Upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'Image/png',
    'Image/webp',
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, fileFilter });

// for user registration

router.post('/organiserregister', upload.single('myFile'), async (req, res) => {
  let photo = req.file ? req.file.filename : null;
  let {
    fname,
    venueName,
    email,
    password,
    cpassword,
    phone,
    address,
    pinCode,
    venueCategory,
    city,
    state,
    country,
  } = req.body;
  let preuser = await organiserdb.findOne({ email: email });
  if (preuser) {
    res.status(422).json({ error: 'This Email is Already Exist' });
  } else if (password !== cpassword) {
    res.status(422).json({ error: 'Password and Confirm Password Not Match' });
  }
  let data = new organiserdb({
    fname,
    venueName,
    email,
    password,
    cpassword,
    phone,
    address,
    pinCode,
    photo,
    venueCategory,
    city,
    state,
    country,
  });

  let response = await data.save();
  res.status(200).json({ message: 'User Added SuccessFully' });
  try {
    const userfind = await organiserdb.findOne({ email: email });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Sign Up successfull',
      text: `Your registration is successfully done!! Please wait to confirm your registration by our administration...`,
      html: 'Your registration is successfully done!! Please wait to confirm your registration by our administration...',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('error', error);
        res.status(401).json({ status: 401, message: 'email not send' });
      } else {
        console.log('Email sent', info.response);
        res.status(201).json({ status: 201, message: 'Email sent Succsfully' });
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, message: 'invalid user' });
  }
});

//Update organiserValidation

// router.post('/updateorganiser/:id', async (req, res) => {
//   try {
//     const user = await organiserdb.findOne({ id: req.params.id });
//     if (!user) return res.status(400).json({ message: 'Invalid link' });
//     await organiserdb.updateMany({ id: user.id, validUser: true });
//     res.status(200).json({ message: 'Organiser Verified SuccessFully' });
//   } catch (error) {
//     res.status(404).json({ message: error.stack });
//   }
// });

router.patch(`/updateorganiser/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await organiserdb.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json({ message: 'Organiser Validate SuccessFully' });
    // res.status(200).json(bookingData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
// user Login

router.post('/organiserlogin', async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: 'fill all the details' });
  }

  try {
    const userValid = await organiserdb.findOne({
      email: email,
      validUser: true,
    });

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: 'invalid details' });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie('usercookie', token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    } else {
      res.status(401).json({ status: 401, message: 'invalid details' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
    console.log('catch block');
  }
});

// user valid
router.get('/organiservalid', authenticate, async (req, res) => {
  try {
    const ValidUserOne = await organiserdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout

router.get('/organiserlogout', authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie('organisercookie', { path: '/' });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// send email Link For reset Password
router.post('/organisersendpasswordlink', async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: 'Enter Your Email' });
  }

  try {
    const userfind = await organiserdb.findOne({
      email: email,
      validUser: true,
    });

    // token generate for reset password
    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: '120s',
    });

    const setusertoken = await organiserdb.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Sending Email For password Reset',
        text: `This Link is Valid For only 2 MINUTES http://localhost:3003/organiserforgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
        html: `This Link is Valid For only 2 MINUTES <button style="background-color:#1B355C; color:white; border-radius:5px; text-align:center;padding:0.5rem"><a style="text-decoration:none; color:white;text-align:center;" href="http://localhost:3003/organiserforgotpassword/${userfind.id}/${setusertoken.verifytoken}"><b>Click Here</b><a/></button>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('error', error);
          res.status(401).json({ status: 401, message: 'email not send' });
        } else {
          console.log('Email sent', info.response);
          res
            .status(201)
            .json({ status: 201, message: 'Email sent Succsfully' });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: 'invalid user' });
  }
});

// router.post(
//   '/uploadVenueImages/:id',
//   upload.array('imgCollection', 6),
//   (req, res) => {
//     try {
//       const reqFiles = [];
//       const url = req.protocol + '://' + req.get('host');
//       for (var i = 0; i < req.files.length; i++) {
//         reqFiles.push(url + '/public/imagesOfVenues/' + req.files[i].filename);
//       }

//       let user = new organiserdb({
//         imgCollection: reqFiles,
//       });
//       user
//         .save()
//         .then((result) => {
//           res.status(201).json({
//             message: 'Done upload!',
//             userCreated: {
//               imgCollection: result.imgCollection,
//             },
//           });
//         })
//         .catch((err) => {
//           console.log(err),
//             res.status(500).json({
//               error: err,
//             });
//         });
//       // organiserdb.findByIdAndUpdate({ id: user.id, imgCollection: reqFiles });
//       res.status(200).json({ message: 'Venue Photos Added SuccessFully!!' });
//     } catch (error) {
//       res.status(404).json({ message: error.stack });
//     }
//   }
// );

// verify user for forgot password time

router.get('/organiserforgotpassword/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  try {
    const validusers = await organiserdb.findOne({
      _id: id,
      verifytoken: token,
      validUser: true,
    });

    const verifyToken = jwt.verify(token, keysecret);

    console.log(verifyToken);

    if (validusers && verifyToken._id) {
      res.status(201).json({ status: 201, validusers });
    } else {
      res.status(401).json({ status: 401, message: 'user not exist' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// change password

router.post('/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;

  try {
    const validuser = await organiserdb.findOne({
      _id: id,
      verifytoken: token,
      validUser: true,
    });

    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await organiserdb.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );

      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass });
    } else {
      res.status(401).json({ status: 401, message: 'organiser not exist' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//Get all organisers
router.get('/getallorganisers', async (req, res) => {
  try {
    const users = await organiserdb.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

router.get('/getOrganiserById/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const users = await organiserdb.findById({ _id: id });
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

//get organiser by bookingId

router.get('/getOrganiserByBookingId/:id', async (req, res) => {
  const organisersData = await bookingdb
    .find({ organiser_Id: req.params.id })
    .populate('organiser_Id')
    .exec(function (err, organisersData) {
      if (err) console.log(err);
      res.json(organisersData);
    });
});

//Delete Organiser
router.delete('/deleteorganiser/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await organiserdb.findByIdAndRemove({ _id: id });
    res.status(200).send('User Deleted successfully');
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});
module.exports = router;

// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true
