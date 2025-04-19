const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.status(200).json(courses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  res.status(200).json(course);
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    content, 
    level, 
    duration, 
    instructor, 
    image, 
    price, 
    isFree 
  } = req.body;

  if (!title || !description || !duration || !instructor) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const course = await Course.create({
    title,
    description,
    content: content || [],
    level,
    duration,
    instructor,
    image,
    price,
    isFree
  });

  res.status(201).json(course);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { 
      ...req.body,
      updatedAt: Date.now()
    },
    { new: true }
  );
  
  res.status(200).json(updatedCourse);
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  await Course.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ message: 'Course removed' });
});

// @desc    Get course modules
// @route   GET /api/courses/:id/modules
// @access  Public
const getCourseModules = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  res.status(200).json(course.content);
});

// @desc    Get specific module
// @route   GET /api/courses/:id/modules/:moduleId
// @access  Public
const getModule = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  const module = course.content.find(
    m => m.moduleNumber === parseInt(req.params.moduleId)
  );
  
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }
  
  res.status(200).json(module);
});

// @desc    Get specific lesson
// @route   GET /api/courses/:id/modules/:moduleId/lessons/:lessonId
// @access  Public
const getLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  const module = course.content.find(
    m => m.moduleNumber === parseInt(req.params.moduleId)
  );
  
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }
  
  const lesson = module.lessons.find(
    l => l.lessonNumber === parseInt(req.params.lessonId)
  );
  
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }
  
  res.status(200).json(lesson);
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseModules,
  getModule,
  getLesson
};
