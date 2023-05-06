const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    imgCollection: {
      type: Array,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true },
  {
    collection: 'vanues',
  }
);
module.exports = mongoose.model('vanues', userSchema);
