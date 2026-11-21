import express from 'express';
import {
    addShoppingItem,
    deleteShoppingItem,
    generateShoppingList,
    getShoppingList,
    updateShoppingItem
} from '../controllers/mealPlanner.controller.js';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:weekStart', auth, getShoppingList);
router.post('/:weekStart/generate', auth, generateShoppingList);
router.post('/:weekStart/items', auth, addShoppingItem);
router.patch('/:weekStart/items/:itemId', auth, updateShoppingItem);
router.delete('/:weekStart/items/:itemId', auth, deleteShoppingItem);

export default router;
