const express = require('express');
const router = new express.Router();
const userdb = require('../models/userSchema');
var bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const organiserdb = require('../models/OrganiserSchema');
const bookingdb = require('../models/Booking');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const paymentdb = require('../models/Payment');
const artistorganisersdb = require('../models/ArtistLinkWithOrganisers');

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
    'image/png',
    'image/webp',
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, fileFilter });

// for user registration

router.post('/register', upload.single('myFile'), async (req, res) => {
  let photo = req.file ? req.file.filename : null;
  let { fname, email, password, cpassword, phone, address, pinCode } = req.body;
  let preuser = await userdb.findOne({ email: email });
  if (preuser) {
    res.status(422).json({ error: 'This Email is Already Exist' });
  } else if (password !== cpassword) {
    res.status(422).json({ error: 'Password and Confirm Password Not Match' });
  }
  let data = new userdb({
    fname,
    email,
    password,
    cpassword,
    phone,
    address,
    pinCode,
    photo,
  });
  let response = await data.save();
  res.status(200).json({ message: 'User Added SuccessFully' });
  try {
    const userfind = await userdb.findOne({ email: email });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Sign Up successfull',
      text: `You are now successfully signup with Event Partners!!`,
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

// user Login

router.post('/login', async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: 'fill all the details' });
  }

  try {
    const userValid = await userdb.findOne({ email: email });

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
router.get('/validuser', authenticate, async (req, res) => {
  try {
    const ValidUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout

router.get('/logout', authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie('usercookie', { path: '/' });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//Get all organisers
router.get('/getallorganisers', async (req, res) => {
  try {
    const users = await organiserdb.find({ validUser: true });
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

//Give rating to Organisers
router.put('/rating', authenticate, async (req, res) => {
  const { _id } = req.userId;
  const { star, comments, organiserId } = req.body;
  try {
    const organiser = await organiserdb.findById(organiserId);
    let alreadyRated = organiser.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await organiserdb.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comments': comments },
        },
        {
          new: true,
        }
      );
    } else {
      const rateOrganiser = await organiserdb.findByIdAndUpdate(
        organiserId,
        {
          $push: {
            ratings: {
              star: star,
              comments: comments,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getAllRatings = await organiserdb.findById(organiserId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = (ratingSum / totalRating).toFixed(1);
    let finalRating = await organiserdb.findByIdAndUpdate(
      organiserId,
      {
        totalRating: actualRating,
      },
      {
        new: true,
      }
    );
    res.json(finalRating);
  } catch (error) {
    console.log(error);
  }
});

router.post('/bookEvents', authenticate, async (req, res) => {
  const { _id } = req.userId;

  let {
    userName,
    bookingDate,
    eventName,
    requiredArtist,
    requiredArtistPrice,
    foodList,
    foodDishPrice,
    totalPrice,
    guest,
    organiser_Id,
    organiserPhoto,
    paymentStatus,
    organiserPhone,
    balance,
    venueName,
  } = req.body;

  let data = new bookingdb({
    userName,
    bookingDate,
    eventName,
    requiredArtist,
    requiredArtistPrice,
    foodList,
    foodDishPrice,
    totalPrice,
    guest,
    paymentStatus,
    organiser_Id,
    organiserPhoto,
    venueName,
    balance,
    organiserPhone,
    bookedBy: _id,
  });

  let response = await data.save();

  res.status(200).json({ res: response });
});

// router.post('/joinVenue', authenticate, async (req, res) => {
//   const { _id } = req.userId;

//   const { organiser_Id } = req.params.id;

//   let data = new bookingdb({
//     organiser_Id: organiser_Id,
//     bookedBy: _id,
//   });

//   let response = await data.save();

//   res.status(200).json({ res: response });
// });

router.post('/payment', authenticate, async (req, res) => {
  const { _id } = req.userId;

  let { payAmount, bookingId, percentage } = req.body;

  let data = new paymentdb({
    payAmount,
    bookingId,
    percentage,
    bookedBy: _id,
  });

  let response = await data.save();

  res.status(200).json({ res: response });
});

router.patch(`/cancelBookingById/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const bookingData = await bookingdb.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ message: 'Booking Cancel SuccessFully' });
    // res.status(200).json(bookingData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.patch(`/CalculateTotalBalanceByBookingId/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const bookingData = await bookingdb.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ message: 'Balance Updated SuccessFully' });
    // res.status(200).json(bookingData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// router.post(`/JoinWithVenues`, async (req, res) => {
//   let { artistsName, requestDate, eventName, requestedBy } = req.body;

//   let data = new artistorganisersdb({
//     artistsName,
//     requestDate,
//     eventName,
//     requestedBy,
//   });

//   let response = await data.save();

//   res.status(200).json({ res: response });
// });

router.get('/delete/:id', authenticate, (req, res) => {
  id = req.params.id;
  user = req.user;
  organiserdb.update({}, { $pull: { organiser_Id: id } });
  organiser_Ids = user.bookings;
  res.render('bookings/all', {
    bookings: organiser_Ids,
  });
});

//get all payment details by orderId
router.get('/viewPaymentsByOrderId/:id', async (req, res) => {
  const organisersData = await paymentdb
    .find({ bookingId: req.params.id })
    .populate('bookingId')
    .exec(function (err, bookingData) {
      if (err) console.log(err);
      res.json(bookingData);
    });
});

//Get Users Rating by UserId

router.get('/getUserById/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userData = [];
    let users = await userdb.findById({ _id: id });
    userData.push(users);
    res.status(200).send(userData);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

//Get Booking Details by Id

router.get('/getBookingDetails/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await bookingdb.findById({ _id: id });
    res.status(200).send(booking);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

// send email Link For reset Password
router.post('/sendpasswordlink', async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: 'Enter Your Email' });
  }

  try {
    const userfind = await userdb.findOne({ email: email });

    // token generate for reset password
    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: '120s',
    });

    const setusertoken = await userdb.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Sending Email For password Reset',
        text: `This Link Valid For 2 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
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

//get all booking details by userId
router.get('/viewBookingsByUserId/:id', async (req, res) => {
  const organisersData = await bookingdb
    .find({ bookedBy: req.params.id })
    .populate('bookedBy')
    .exec(function (err, bookingData) {
      if (err) console.log(err);
      res.json(bookingData);
    });
});

//get all booking details by organiserId
router.post('/viewBookingsByOrganiserId/', async (req, res) => {
  const organisersData = await bookingdb
    .find({ organiser_Id: req.body })
    .populate('organiser_Id')
    .exec(function (err, bookingData) {
      if (err) console.log(err);
      res.json(organisersData);
    });
});

//get all booking details

router.get('/getallBookingDetails', async (req, res) => {
  try {
    const bookingDetails = await bookingdb.find({});
    res.status(200).send(bookingDetails);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

// verify user for forgot password time
router.get('/forgotpassword/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await userdb.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    console.log(verifyToken);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser });
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
    const validuser = await userdb.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await userdb.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );

      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass });
    } else {
      res.status(401).json({ status: 401, message: 'user not exist' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//Access all users
router.get('/getallusers', async (req, res) => {
  try {
    const users = await userdb.find({});
    res.status(200).send(users);
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
