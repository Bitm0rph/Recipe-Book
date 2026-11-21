import mongoose from 'mongoose';
import MealPlan from '../models/mealPlan.model.js';
import Recipe from '../models/recipe.model.js';
import ShoppingList from '../models/shoppingList.model.js';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
const dayInMilliseconds = 24 * 60 * 60 * 1000;

const isValidDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const getWeekEnd = (weekStart) => {
    const date = new Date(`${weekStart}T00:00:00.000Z`);
    date.setTime(date.getTime() + 6 * dayInMilliseconds);
    return date.toISOString().slice(0, 10);
};

const itemKey = (name) => name.trim().toLowerCase();

const sendError = (res, error, fallbackMessage, duplicateMessage = 'This entry already exists.') => {
    console.error(error);
    if (error.code === 11000) {
        return res.status(409).json({ message: duplicateMessage });
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: fallbackMessage });
};

export const getMealPlans = async (req, res) => {
    const { start, end } = req.query;
    if (!isValidDate(start) || !isValidDate(end) || start > end) {
        return res.status(400).json({ message: 'A valid start and end date are required.' });
    }

    try {
        const plans = await MealPlan.find({
            user: req.user._id,
            date: { $gte: start, $lte: end }
        })
            .populate('recipe', 'title imageUrl ingredients')
            .sort({ date: 1, mealType: 1, createdAt: 1 });
        return res.json(plans);
    } catch (error) {
        return sendError(res, error, 'Failed to load meal plans.');
    }
};

export const createMealPlan = async (req, res) => {
    const { recipeId, date, mealType } = req.body || {};
    if (!mongoose.isValidObjectId(recipeId) || !isValidDate(date) || !mealTypes.includes(mealType)) {
        return res.status(400).json({ message: 'A valid recipe, date, and meal type are required.' });
    }

    try {
        const recipeExists = await Recipe.exists({ _id: recipeId });
        if (!recipeExists) return res.status(404).json({ message: 'Recipe not found.' });

        const plan = await MealPlan.create({
            user: req.user._id,
            recipe: recipeId,
            date,
            mealType
        });
        await plan.populate('recipe', 'title imageUrl ingredients');
        return res.status(201).json(plan);
    } catch (error) {
        return sendError(
            res,
            error,
            'Failed to add recipe to the meal plan.',
            'This recipe is already planned for that meal.'
        );
    }
};

export const deleteMealPlan = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid meal plan ID.' });
    }

    try {
        const plan = await MealPlan.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!plan) return res.status(404).json({ message: 'Meal plan entry not found.' });
        return res.json({ message: 'Meal plan entry removed.' });
    } catch (error) {
        return sendError(res, error, 'Failed to remove meal plan entry.');
    }
};

export const getShoppingList = async (req, res) => {
    const { weekStart } = req.params;
    if (!isValidDate(weekStart)) {
        return res.status(400).json({ message: 'A valid week start date is required.' });
    }

    try {
        const list = await ShoppingList.findOne({ user: req.user._id, weekStart });
        return res.json(list || { weekStart, items: [] });
    } catch (error) {
        return sendError(res, error, 'Failed to load shopping list.');
    }
};

export const generateShoppingList = async (req, res) => {
    const { weekStart } = req.params;
    if (!isValidDate(weekStart)) {
        return res.status(400).json({ message: 'A valid week start date is required.' });
    }

    try {
        const weekEnd = getWeekEnd(weekStart);
        const plans = await MealPlan.find({
            user: req.user._id,
            date: { $gte: weekStart, $lte: weekEnd }
        }).populate('recipe', 'title ingredients');

        const generatedByIngredient = new Map();
        plans.forEach((plan) => {
            if (!plan.recipe) return;
            (plan.recipe.ingredients || []).forEach((ingredient) => {
                const name = ingredient.name?.trim();
                if (!name) return;

                const key = itemKey(name);
                const entry = generatedByIngredient.get(key) || { name, quantities: [] };
                const quantity = ingredient.quantity?.trim() || 'Amount not specified';
                entry.quantities.push(`${quantity} (${plan.recipe.title})`);
                generatedByIngredient.set(key, entry);
            });
        });

        const list = await ShoppingList.findOne({ user: req.user._id, weekStart })
            || new ShoppingList({ user: req.user._id, weekStart });
        const previousPlannedItems = new Map(
            list.items
                .filter((item) => item.source === 'planned')
                .map((item) => [itemKey(item.name), item])
        );
        const customItems = list.items.filter((item) => item.source === 'custom');
        const plannedItems = [...generatedByIngredient.entries()].map(([key, item]) => {
            const previous = previousPlannedItems.get(key);
            return {
                _id: previous?._id,
                name: item.name,
                quantity: item.quantities.join('; '),
                checked: previous?.checked || false,
                source: 'planned'
            };
        });

        list.items = [...customItems, ...plannedItems];
        await list.save();
        return res.json(list);
    } catch (error) {
        return sendError(res, error, 'Failed to generate shopping list.');
    }
};

export const addShoppingItem = async (req, res) => {
    const { weekStart } = req.params;
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const quantity = typeof req.body?.quantity === 'string' ? req.body.quantity.trim() : '';
    if (!isValidDate(weekStart) || !name) {
        return res.status(400).json({ message: 'A valid week start date and item name are required.' });
    }

    try {
        const list = await ShoppingList.findOneAndUpdate(
            { user: req.user._id, weekStart },
            {
                $setOnInsert: { user: req.user._id, weekStart },
                $push: { items: { name, quantity, source: 'custom' } }
            },
            { new: true, upsert: true, runValidators: true }
        );
        return res.status(201).json(list);
    } catch (error) {
        return sendError(res, error, 'Failed to add shopping list item.');
    }
};

export const updateShoppingItem = async (req, res) => {
    const { weekStart, itemId } = req.params;
    if (!isValidDate(weekStart) || !mongoose.isValidObjectId(itemId)) {
        return res.status(400).json({ message: 'Invalid shopping list or item ID.' });
    }

    try {
        const list = await ShoppingList.findOne({ user: req.user._id, weekStart });
        if (!list) return res.status(404).json({ message: 'Shopping list not found.' });
        const item = list.items.id(itemId);
        if (!item) return res.status(404).json({ message: 'Shopping list item not found.' });

        const updates = req.body || {};
        if (updates.name !== undefined) {
            if (typeof updates.name !== 'string' || !updates.name.trim()) {
                return res.status(400).json({ message: 'Item name cannot be empty.' });
            }
            item.name = updates.name.trim();
        }
        if (updates.quantity !== undefined) {
            if (typeof updates.quantity !== 'string') {
                return res.status(400).json({ message: 'Item quantity must be text.' });
            }
            item.quantity = updates.quantity.trim();
        }
        if (updates.checked !== undefined) {
            if (typeof updates.checked !== 'boolean') {
                return res.status(400).json({ message: 'Checked status must be true or false.' });
            }
            item.checked = updates.checked;
        }

        await list.save();
        return res.json(list);
    } catch (error) {
        return sendError(res, error, 'Failed to update shopping list item.');
    }
};

export const deleteShoppingItem = async (req, res) => {
    const { weekStart, itemId } = req.params;
    if (!isValidDate(weekStart) || !mongoose.isValidObjectId(itemId)) {
        return res.status(400).json({ message: 'Invalid shopping list or item ID.' });
    }

    try {
        const list = await ShoppingList.findOne({ user: req.user._id, weekStart });
        if (!list) return res.status(404).json({ message: 'Shopping list not found.' });
        const item = list.items.id(itemId);
        if (!item) return res.status(404).json({ message: 'Shopping list item not found.' });
        item.deleteOne();
        await list.save();
        return res.json(list);
    } catch (error) {
        return sendError(res, error, 'Failed to remove shopping list item.');
    }
};
