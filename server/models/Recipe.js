const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'You muse supply a name!',
  },
  ingredients: [String],
  type: String, // breakfast, dinner, snack, etc
  description: String,
  rating: Number,
  photo: String,
});

module.exports = mongoose.model('Recipe', recipeSchema);