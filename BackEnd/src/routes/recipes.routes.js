import express from 'express';
import Recipe from '../models/recipe.model.js';
import {verifyJWT as auth} from '../middlewares/auth.middleware.js';


const router = express.Router();

// get recipes by user
router.get('/user/:userId', async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.params.userId }).populate('author', 'name email');
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// get all (with pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const recipes = await Recipe.find().populate('author', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Recipe.countDocuments();
        res.json({ data: recipes, page, totalPages: Math.ceil(total / limit), total });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// get single
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'name email');
        if (!recipe) return res.status(404).json({ message: 'Not found' });
        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// create recipe (protected)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, ingredients, steps, imageUrl, tags } = req.body;
        const recipe = new Recipe({ title, description, ingredients, steps, imageUrl, tags, author: req.user.id });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// update (Only the user who have created the recipe can update it)
router.put('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Not found' });
        if (recipe.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });


        const updates = req.body;
        updates.updatedAt = new Date();
        const updated = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// delete (Only the user who have created the recipe can delete it)
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Not found' });
        if (recipe.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });


        await recipe.remove();
        res.json({ message: 'Recipe removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


export default router;