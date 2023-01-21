const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  photourl: {
    type: String,
    required: true,
  },
  description: String,

  date: {
    type: Date,
    default: Date.now,
  },
});


module.exports = productSchema;