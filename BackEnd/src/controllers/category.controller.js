import Category from '../models/category.model.js';
import Recipe from '../models/recipe.model.js';


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ data: categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}


export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });

    // Optionally get recipes in this category
    const recipes = await Recipe.find({ tags: category.name })
      .select('-ingredients -steps')
      .populate('author', 'username email');
    
    res.json({ category, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export const updateCategory = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

