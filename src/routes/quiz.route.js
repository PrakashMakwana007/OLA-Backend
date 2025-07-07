import express from 'express';
import {
  cratequiz,
  getAllquiz,
  getquizbyId,
  deleteQuiz,
  submitQuizResponse
} from '../controller/quix.js';

import { protect } from '../middlewares/auth.middlewere.js';

const router = express.Router();

// Apply auth middleware
router.use(protect);

// Create quiz
router.post('/', cratequiz);

// Get all quizzes
router.get('/', getAllquiz);

// Get single quiz by ID
router.get('/:quizId', getquizbyId);

router.post('/submit', submitQuizResponse); 

// Delete quiz by ID
router.delete('/:quizId', deleteQuiz);

export default router;
  