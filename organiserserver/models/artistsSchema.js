const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// mongoose.Types.ObjectId.isValid('your id here');

const keysecret = process.env.SECRET_KEY;

const artistsSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
    },
    id: {
      type: mongoose.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    organiserId: {
      type: mongoose.Schema.Types.ObjectId,
      default: '643654594db3ac9a63fb4f1a',
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
    validArtists: {
      type: Boolean,
      default: false,
    },
    artistsType: {
      type: Array,
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
  },
  { timestamps: true }
);

// hash password

artistsSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// token generate
artistsSchema.methods.generateAuthtoken = async function () {
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
const artistsdb = new mongoose.model('Artists', artistsSchema);

module.exports = artistsdb;

// if (this.isModified("password")) {    }
