import express from 'express';
import { createRecipe, deleteRecipe, getAllRecipes, getRecipeById, getUserRecipes, updateRecipe } from '../controllers/recipe.controller.js';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();

// get recipes by user
router.get('/mine', auth, getUserRecipes);
router.get('/user/:userId', auth, getUserRecipes);


// get all (with pagination)
router.get('/', getAllRecipes);


// get a specific recipe with view increment
router.get('/:id', auth, getRecipeById);


// create recipe (protected)
router.post('/', auth, upload.single('image'), createRecipe);


// update (Only the user who have created the recipe can update it)
router.put('/:id', auth, upload.single('image'), updateRecipe);


// delete (Only the user who have created the recipe can delete it)
router.delete('/:id', auth, deleteRecipe);


export default router;