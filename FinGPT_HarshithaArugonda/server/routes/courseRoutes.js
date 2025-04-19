const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getCourseModules,
  getModule,
  getLesson
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);
router.get('/:id/modules', getCourseModules);
router.get('/:id/modules/:moduleId', getModule);
router.get('/:id/modules/:moduleId/lessons/:lessonId', getLesson);

// Admin only routes
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

module.exports = router;
