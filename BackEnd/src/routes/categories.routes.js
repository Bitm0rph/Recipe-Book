import express from 'express';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller.js';


const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

// Get single category by ID
router.get('/:id', getCategoryById);

// Create a new category (protected)
router.post('/', auth, createCategory);

// Update category (protected)
router.put('/:id', auth, updateCategory);

// Delete category (protected)
router.delete('/:id', auth, deleteCategory);

export default router;
