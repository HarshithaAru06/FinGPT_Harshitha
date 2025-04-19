const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Feedback = require('../models/Feedback');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.status(200).json(user);
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Update user fields
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { 
      ...req.body,
      // Don't allow password updates through this route
      password: undefined
    },
    { new: true }
  ).select('-password');
  
  res.status(200).json(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Don't allow deleting the current admin
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }
  
  await User.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ message: 'User removed' });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!role || !['user', 'admin', 'instructor'].includes(role)) {
    res.status(400);
    throw new Error('Please provide a valid role');
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Don't allow changing your own role
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot change your own role');
  }
  
  user.role = role;
  await user.save();
  
  res.status(200).json({ 
    _id: user._id,
    email: user.email,
    role: user.role
  });
});

// @desc    Get user statistics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const instructorUsers = await User.countDocuments({ role: 'instructor' });
  const regularUsers = await User.countDocuments({ role: 'user' });
  
  // Get new users in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  // Get active users (logged in within last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: sevenDaysAgo }
  });
  
  res.status(200).json({
    totalUsers,
    adminUsers,
    instructorUsers,
    regularUsers,
    newUsers,
    activeUsers
  });
});

// @desc    Get course statistics
// @route   GET /api/admin/analytics/courses
// @access  Private/Admin
const getCourseStats = asyncHandler(async (req, res) => {
  const totalCourses = await Course.countDocuments();
  
  // Get enrollments per course
  const courses = await Course.find({}).select('title');
  const courseEnrollments = await Promise.all(
    courses.map(async (course) => {
      const count = await Enrollment.countDocuments({ course: course._id });
      return {
        courseId: course._id,
        title: course.title,
        enrollments: count
      };
    })
  );
  
  // Get total enrollments
  const totalEnrollments = await Enrollment.countDocuments();
  
  // Get average progress across all enrollments
  const enrollments = await Enrollment.find({});
  const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
  const averageProgress = enrollments.length > 0 ? totalProgress / enrollments.length : 0;
  
  // Get completion rate (enrollments with 100% progress)
  const completedEnrollments = enrollments.filter(e => e.progress === 100).length;
  const completionRate = enrollments.length > 0 ? (completedEnrollments / enrollments.length) * 100 : 0;
  
  res.status(200).json({
    totalCourses,
    totalEnrollments,
    averageProgress,
    completionRate,
    courseEnrollments
  });
});

// @desc    Get feedback statistics
// @route   GET /api/admin/analytics/feedback
// @access  Private/Admin
const getFeedbackStats = asyncHandler(async (req, res) => {
  const totalFeedback = await Feedback.countDocuments();
  
  // Get average rating
  const feedbacks = await Feedback.find({});
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
  
  // Get feedback distribution by rating
  const ratingDistribution = {
    1: await Feedback.countDocuments({ rating: 1 }),
    2: await Feedback.countDocuments({ rating: 2 }),
    3: await Feedback.countDocuments({ rating: 3 }),
    4: await Feedback.countDocuments({ rating: 4 }),
    5: await Feedback.countDocuments({ rating: 5 })
  };
  
  // Get recent feedback
  const recentFeedback = await Feedback.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'email');
  
  res.status(200).json({
    totalFeedback,
    averageRating,
    ratingDistribution,
    recentFeedback
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStats,
  getCourseStats,
  getFeedbackStats
};
