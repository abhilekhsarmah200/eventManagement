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
});
