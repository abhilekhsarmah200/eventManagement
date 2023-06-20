const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY;

const artistsOrganizationSchema = new mongoose.Schema(
  {
    artistsName: { type: String },
    requestAccepted: { type: Boolean, default: false },
    requestDate: { type: Date },
    eventName: { type: String },
    photo: {
      type: String,
    },
    artistsPhoto: {
      type: String,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artists',
    },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    joinWith: { type: mongoose.Schema.Types.ObjectId, ref: 'organisers' },
  },
  {
    timestamps: true,
  }
);

// hash password

artistsOrganizationSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// token generate
artistsOrganizationSchema.methods.generateAuthtoken = async function () {
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
const artistorganisersdb = new mongoose.model(
  'artistOrganization',
  artistsOrganizationSchema
);

module.exports = artistorganisersdb;

// if (this.isModified("password")) {    }
