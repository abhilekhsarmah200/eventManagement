const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY;

const bookingSchema = new mongoose.Schema(
  {
    userName: { type: String },
    bookingDate: { type: Date },
    eventName: { type: String },
    requiredArtist: { type: Array },
    foodList: { type: Array },
    guest: { type: Number },
    totalPrice: { type: Number },
    organiserPhoto: { type: Number },
    venueName: { type: String },
    organiserPhone: { type: Number },
    organiserPhoto: { type: String },
    organiser_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'organisers',
    },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
);

// hash password

bookingSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// token generate
bookingSchema.methods.generateAuthtoken = async function () {
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
const bookingdb = new mongoose.model('bookings', bookingSchema);

module.exports = bookingdb;

// if (this.isModified("password")) {    }
