const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// mongoose.Types.ObjectId.isValid('your id here');

const keysecret = process.env.SECRET_KEY;

const venuesSchema = new mongoose.Schema({
  vanuePhotos: [
    {
      photo: {
        type: String,
        required: true,
      },
    },
  ],

  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  vanueName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
});

// createing model
const userdb = new mongoose.model('organisers', venuesSchema);

module.exports = userdb;

// if (this.isModified("password")) {    }
