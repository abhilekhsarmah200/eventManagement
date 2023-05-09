const express = require('express');
const artistsRouter = new express.Router();
const artistsdb = require('../models/artistsSchema');
var bcrypt = require('bcryptjs');
const artistsAuthenticate = require('../middleware/artistsAuthenticate');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');

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

artistsRouter.post(
  '/artistsregister',
  upload.single('myFile'),
  async (req, res) => {
    let photo = req.file ? req.file.filename : null;
    let {
      fname,
      vanueName,
      email,
      password,
      cpassword,
      artistsType,
      phone,
      address,
      pinCode,
    } = req.body;
    let preuser = await artistsdb.findOne({ email: email });
    if (preuser) {
      res.status(422).json({ error: 'This Email is Already Exist' });
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: 'Password and Confirm Password Not Match' });
    }
    let data = new artistsdb({
      fname,
      vanueName,
      email,
      password,
      cpassword,
      artistsType,
      phone,
      address,
      pinCode,
      photo,
    });

    let response = await data.save();
    res.status(200).json({ message: 'User Added SuccessFully' });
    try {
      const userfind = await artistsdb.findOne({ email: email });

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
          res
            .status(201)
            .json({ status: 201, message: 'Email sent Succsfully' });
        }
      });
    } catch (error) {
      res.status(401).json({ status: 401, message: 'invalid user' });
    }
  }
);

artistsRouter.post('/updateartists/:id', async (req, res) => {
  try {
    const user = await artistsdb.findOne({ id: req.params.id });
    if (!user) return res.status(400).json({ message: 'Invalid link' });
    await artistsdb.updateMany({ id: user.id, validUser: true });
    res.status(200).json({ message: 'Organiser Verified SuccessFully' });
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});
// user Login

artistsRouter.post('/artistslogin', async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: 'fill all the details' });
  }

  try {
    const userValid = await artistsdb.findOne({
      email: email,
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
artistsRouter.get('/artistsvalid', artistsAuthenticate, async (req, res) => {
  try {
    const ValidUserOne = await artistsdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout

artistsRouter.get('/artistslogout', artistsAuthenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie('artistscookie', { path: '/' });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// send email Link For reset Password
artistsRouter.post('/artistssendpasswordlink', async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: 'Enter Your Email' });
  }

  try {
    const userfind = await artistsdb.findOne({ email: email });

    // token generate for reset password
    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: '120s',
    });

    const setusertoken = await artistsdb.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    // let url = [
    //   {
    //     forgetLink: [
    //       <a
    //         href={`http://localhost:3003/artistsforgotpassword/${userfind.id}/${setusertoken.verifytoken}`}
    //       >
    //         hello
    //       </a>,
    //     ],
    //   },
    // ];

    if (setusertoken) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Sending Email For password Reset',
        text: `This Link is Valid For only 2 MINUTES http://localhost:3003/artistsforgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
        html: `This Link is Valid For only 2 MINUTES <button><a href="http://localhost:3003/artistsforgotpassword/${userfind.id}/${setusertoken.verifytoken}"><b>Click Here</b><a/></button>`,
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

// verify user for forgot password time
artistsRouter.get('/artistsforgotpassword/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await artistsdb.findOne({ _id: id, verifytoken: token });

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

artistsRouter.post('/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;

  try {
    const validuser = await artistsdb.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await artistsdb.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );

      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass });
    } else {
      res.status(401).json({ status: 401, message: 'artists not exist' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//Get all artistss
artistsRouter.get('/getallartists', async (req, res) => {
  try {
    const users = await artistsdb.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

artistsRouter.get('/getArtistsById/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const users = await artistsdb.findById({ _id: id });
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});

//Delete Organiser
artistsRouter.delete('/deleteartists/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await artistsdb.findByIdAndRemove({ _id: id });
    res.status(200).send('User Deleted successfully');
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
});
module.exports = artistsRouter;

// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true
