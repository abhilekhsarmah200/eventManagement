const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY;

const bookingSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    eventName: { type: String, required: true },
    requiredArtist: { type: String },
    artist: { type: String, default: '' },
    requiredArtistPrice: { type: String },
    is_canceled: { type: Boolean, default: false },
    foodList: { type: String, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    foodDishPrice: { type: String },
    artistsName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: '643654594db3ac9a63fb4f1a',
    },
    guest: { type: Number, required: true },
    totalPrice: { type: Number },
    balance: { type: Number },
    organiserPhoto: { type: Number },
    venueName: { type: String },
    organiserPhone: { type: Number },
    organiserPhoto: { type: String },
    organiser_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
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
