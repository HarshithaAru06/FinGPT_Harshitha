const express = require('express');
const router = express.Router();
const { 
  getUserEnrollments, 
  enrollInCourse, 
  getEnrollmentDetails, 
  updateProgress, 
  submitQuiz 
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getUserEnrollments)
  .post(enrollInCourse);

router.route('/:id')
  .get(getEnrollmentDetails);

router.route('/:id/progress')
  .put(updateProgress);

router.route('/:id/quiz')
  .put(submitQuiz);

module.exports = router;
