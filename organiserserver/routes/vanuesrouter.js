const express = require('express');
const vanuerouter = new express.Router();
const vanuedb = require('../models/venuesSchema');
var bcrypt = require('bcryptjs');
const vanueAuthenticate = require('../middleware/vanueAuthenticate');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

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
    cb(null, 'public/imagesOfVanues');
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

vanuerouter.post('/addVanues', upload.single('myFiles'), async (req, res) => {
  let photo = req.file ? req.file.filename : null;
  let { userId, vanueName, phone, address, pinCode } = req.body;
  let data = new vanuedb({
    userId,
    vanueName,
    phone,
    address,
    pinCode,
    photo,
  });
  let response = await data.save();
  res.status(200).json({ message: 'User Added SuccessFully' });
});

// vanuerouter.get('/vanuelistValid', vanueAuthenticate, async (req, res) => {
//   try {
//     const ValidUserOne = await vanuedb.findOne({ _id: req.userId });
//     res.status(201).json({ status: 201, ValidUserOne });
//   } catch (error) {
//     res.status(401).json({ status: 401, error });
//   }
// });

module.exports = vanuerouter;
