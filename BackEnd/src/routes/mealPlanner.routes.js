import express from 'express';
import {
    createMealPlan,
    deleteMealPlan,
    getMealPlans
} from '../controllers/mealPlanner.controller.js';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getMealPlans);
router.post('/', auth, createMealPlan);
router.delete('/:id', auth, deleteMealPlan);

export default router;
