const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// mongoose.Types.ObjectId.isValid('your id here');

const keysecret = process.env.SECRET_KEY;

const venuesSchema = new mongoose.Schema({
  photo: {
    type: String,
  },
  userId: {
    type: String,
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
const vanuedb = new mongoose.model('vanues', venuesSchema);

module.exports = vanuedb;

// if (this.isModified("password")) {    }
