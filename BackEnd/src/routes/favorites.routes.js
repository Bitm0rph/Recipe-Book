import express from 'express';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';
import { addRecipeToFavorite, getUserFavorites, removeRecipeToFavorite } from '../controllers/favorite.controller.js';


const router = express.Router();

// Get current user's favorites
router.get('/', auth, getUserFavorites);

// Add recipe to favorites
router.post('/:recipeId', auth, addRecipeToFavorite);

// Remove recipe from favorites
router.delete('/:recipeId', auth, removeRecipeToFavorite);

export default router;
