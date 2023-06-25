const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    organiser_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'organisers',
    },
    imgCollection: {
      type: Array,
    },
  },
  { timestamps: true },
  {
    collection: 'venues',
  }
);
const venuedb = (module.exports = mongoose.model('venues', userSchema));
module.exports = venuedb;
