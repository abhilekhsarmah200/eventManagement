const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY;

const relatedVenue = new mongoose.Schema(
  {
    verified: { type: Boolean, default: false },
    organiser_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'organisers',
    },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Artists' },
  },
  {
    timestamps: true,
  }
);

// hash password

relatedVenue.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// token generate
relatedVenue.methods.generateAuthtoken = async function () {
  try {
    let token23 = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: '1d',
    });

    this.tokens = this.tokens.concat({ token: token23 });
    await this.save();
    return token23;
  } catch (error) {
    res.status(422).json(error);
  }
};

// createing model
const relatedVenuedb = new mongoose.model('relatedVenue', relatedVenue);

module.exports = relatedVenuedb;

// if (this.isModified("password")) {    }
