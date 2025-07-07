import express from 'express';
import {
  createCourse,
  getCoures,
  getCourseById,
  delateCourse
} from '../controller/course.js';

import { protect } from '../middlewares/auth.middlewere.js';
import uploadThumbnails from '../middlewares/multer.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', uploadThumbnails, createCourse);


router.get('/courese', getCoures);


router.get('/:id', getCourseById);


router.delete('/:id', delateCourse);

export default router;
