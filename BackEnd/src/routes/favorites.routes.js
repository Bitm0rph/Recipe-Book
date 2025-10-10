import express from 'express';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
import Recipe from '../models/recipe.model.js';

const router = express.Router();

// Get current user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add recipe to favorites
router.post('/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(req.params.recipeId)) {
      user.favorites.push(req.params.recipeId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Remove recipe from favorites
router.delete('/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.recipeId);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
