const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// mongoose.Types.ObjectId.isValid('your id here');

const keysecret = process.env.SECRET_KEY;

const organisersSchema = new mongoose.Schema({
  photo: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  vanueName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('not valid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
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

// hash password

organisersSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// token generate
organisersSchema.methods.generateAuthtoken = async function () {
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
const userdb = new mongoose.model('organisers', organisersSchema);

module.exports = userdb;

// if (this.isModified("password")) {    }
