const mongoose = require('mongoose');

const PosterSchema = new mongoose.Schema({
    title: String,
    desc: String,
    date: String,
    imageBase64: String,
    user : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  });
  

module.exports = mongoose.model('Poster', PosterSchema);
