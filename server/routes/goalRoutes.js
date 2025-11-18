import express from 'express';
import auth from '../middlewares/auth.js';
import {
  createOrUpdateGoal,
  getGoals,
  getTodaySummary,
} from '../controllers/goalController.js';

const router = express.Router();

// Validation removed (no Zod). Keep endpoints simple; controllers should validate required fields.
router.post('/', auth, createOrUpdateGoal); // create/update goal
router.get('/', auth, getGoals); // fetch goals
router.get('/today', auth, getTodaySummary); // small summary & tip

export default router;
