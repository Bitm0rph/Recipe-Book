import express from 'express';
import Category from '../models/category.model.js';
import Recipe from '../models/recipe.model.js';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ data: categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });

    // Optionally get recipes in this category
    const recipes = await Recipe.find({ tags: category.name }).populate('author', 'username email');
    
    res.json({ category, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a new category (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update category (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete category (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
