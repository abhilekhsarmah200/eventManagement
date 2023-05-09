const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY;

const organisersSchema = new mongoose.Schema({
  photo: {
    type: String,
  },
  id: {
    type: mongoose.Types.ObjectId,
    index: true,
    auto: true,
  },
  fname: {
    type: String,
    trim: true,
  },
  vanueName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('not valid email');
      }
    },
  },
  imgCollection: {
    type: Array,
  },
  password: {
    type: String,
    minlength: 6,
  },
  cpassword: {
    type: String,
    minlength: 6,
  },
  validUser: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
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
const organiserdb = new mongoose.model('organisers', organisersSchema);

module.exports = organiserdb;

// if (this.isModified("password")) {    }
