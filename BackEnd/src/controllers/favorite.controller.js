import User from '../models/user.model.js';
import Recipe from '../models/recipe.model.js';

export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export const addRecipeToFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const [user] = await Promise.all([
      User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { favorites: recipe._id } },
        { new: true }
      ),
      Recipe.updateOne(
        { _id: recipe._id },
        { $addToSet: { favorites: req.user._id } }
      )
    ]);
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export const removeRecipeToFavorite = async (req, res) => {
  try {
    const [user] = await Promise.all([
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { favorites: req.params.recipeId } },
        { new: true }
      ),
      Recipe.updateOne(
        { _id: req.params.recipeId },
        { $pull: { favorites: req.user._id } }
      )
    ]);
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

