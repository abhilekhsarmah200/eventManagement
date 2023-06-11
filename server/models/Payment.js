const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY;

const paymentSchema = new mongoose.Schema(
  {
    payAmount: { type: String },
    percentage: { type: Number },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'bookings' },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
);

// hash password

paymentSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// token generate
paymentSchema.methods.generateAuthtoken = async function () {
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
const paymentdb = new mongoose.model('payment', paymentSchema);

module.exports = paymentdb;

// if (this.isModified("password")) {    }
