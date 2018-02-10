const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipe');

exports.createRecipe = async (req, res) => {
  const recipe = await (new Recipe(req.body)).save();

  res.json(recipe);
};

exports.getRecipes = async (req, res) => {
  const stores = await Recipe.find();

  res.json(stores);
};
