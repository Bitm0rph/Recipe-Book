import Recipe from '../models/recipe.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


export const getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.params.userId }).populate('author', 'username email');
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

export const getAllRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const recipes = await Recipe.find()
            .select('-ingredients -steps')
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Recipe.countDocuments();
        res.json({ data: recipes, page, totalPages: Math.ceil(total / limit), total });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

export const getRecipeById = async (req, res) => {
    try {
        const existingRecipe = await Recipe.findById(req.params.id);
        if (!existingRecipe) return res.status(404).json({ message: 'Not found' });

        const isAuthor = req.user?._id?.toString() === existingRecipe.author.toString();
        const recipe = isAuthor
            ? existingRecipe
            : await Recipe.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { views: req.user._id } },
                { new: true }
            );

        if (!recipe) return res.status(404).json({ message: 'Not found' });
        await recipe.populate('author', 'username email');
        res.json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

export const createRecipe = async (req, res) => {
    try {
        const { title, description } = req.body;
        const parseArray = (value) => Array.isArray(value) ? value : JSON.parse(value || "[]");
        const tags = parseArray(req.body.tags);
        const ingredients = parseArray(req.body.ingredients);
        const steps = parseArray(req.body.steps);
        let imageUrl = req.body.imageUrl || "";

        if (req.file) {
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            if (!uploadedImage) {
                return res.status(502).json({ message: "Recipe image upload failed" });
            }
            imageUrl = uploadedImage.secure_url || uploadedImage.url;
        }

        const recipe = new Recipe({ title, description, ingredients, steps, imageUrl, tags, author: req.user._id });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({ message: err.statusCode ? err.message : 'Server error' });
    }
}

export const updateRecipe = async (req, res) => {
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
}

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Not found' });
        if (recipe.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });


        await recipe.deleteOne();
        res.json({ message: 'Recipe removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}