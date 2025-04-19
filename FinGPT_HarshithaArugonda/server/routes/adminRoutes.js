const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  updateUserRole,
  getUserStats,
  getCourseStats,
  getFeedbackStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require admin privileges
router.use(protect);
router.use(admin);

// User management routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/users/:id/role')
  .put(updateUserRole);

// Analytics routes
router.get('/analytics/users', getUserStats);
router.get('/analytics/courses', getCourseStats);
router.get('/analytics/feedback', getFeedbackStats);

module.exports = router;
