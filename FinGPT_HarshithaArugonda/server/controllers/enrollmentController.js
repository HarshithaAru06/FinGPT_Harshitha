const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments
// @access  Private
const getUserEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user.id })
    .populate('course', 'title description image level duration instructor');
  
  res.status(200).json(enrollments);
});

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error('Please provide a course ID');
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: req.user.id,
    course: courseId
  });

  if (existingEnrollment) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    user: req.user.id,
    course: courseId,
    progress: 0,
    completedLessons: [],
    quizScores: [],
    certificateIssued: false
  });

  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate('course', 'title description image level duration instructor');

  res.status(201).json(populatedEnrollment);
});

// @desc    Get enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
const getEnrollmentDetails = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate('course');
  
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  
  // Check if the enrollment belongs to the user
  if (enrollment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to access this enrollment');
  }
  
  res.status(200).json(enrollment);
});

// @desc    Update course progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
  const { progress, moduleId, lessonId } = req.body;
  
  const enrollment = await Enrollment.findById(req.params.id);
  
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  
  // Check if the enrollment belongs to the user
  if (enrollment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this enrollment');
  }
  
  // Update progress
  enrollment.progress = progress || enrollment.progress;
  
  // Add completed lesson if provided
  if (moduleId && lessonId) {
    const lessonExists = enrollment.completedLessons.some(
      lesson => lesson.moduleId === parseInt(moduleId) && lesson.lessonId === parseInt(lessonId)
    );
    
    if (!lessonExists) {
      enrollment.completedLessons.push({
        moduleId: parseInt(moduleId),
        lessonId: parseInt(lessonId),
        completedAt: Date.now()
      });
    }
  }
  
  enrollment.lastAccessedDate = Date.now();
  
  await enrollment.save();
  
  res.status(200).json(enrollment);
});

// @desc    Submit quiz answers
// @route   PUT /api/enrollments/:id/quiz
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { moduleId, lessonId, score } = req.body;
  
  if (!moduleId || !lessonId || score === undefined) {
    res.status(400);
    throw new Error('Please provide moduleId, lessonId, and score');
  }
  
  const enrollment = await Enrollment.findById(req.params.id);
  
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  
  // Check if the enrollment belongs to the user
  if (enrollment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this enrollment');
  }
  
  // Check if quiz already submitted
  const quizIndex = enrollment.quizScores.findIndex(
    quiz => quiz.moduleId === parseInt(moduleId) && quiz.lessonId === parseInt(lessonId)
  );
  
  if (quizIndex !== -1) {
    // Update existing quiz score
    enrollment.quizScores[quizIndex].score = score;
    enrollment.quizScores[quizIndex].completedAt = Date.now();
  } else {
    // Add new quiz score
    enrollment.quizScores.push({
      moduleId: parseInt(moduleId),
      lessonId: parseInt(lessonId),
      score,
      completedAt: Date.now()
    });
  }
  
  enrollment.lastAccessedDate = Date.now();
  
  await enrollment.save();
  
  res.status(200).json(enrollment);
});

module.exports = {
  getUserEnrollments,
  enrollInCourse,
  getEnrollmentDetails,
  updateProgress,
  submitQuiz
};
