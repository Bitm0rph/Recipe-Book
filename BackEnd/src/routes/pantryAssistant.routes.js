import express from 'express';
import { getPantrySuggestions } from '../controllers/pantryAssistant.controller.js';
import { verifyJWT as auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/suggestions', auth, getPantrySuggestions);

export default router;
