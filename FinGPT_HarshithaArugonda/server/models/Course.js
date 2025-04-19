const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: [{
    moduleNumber: Number,
    moduleTitle: String,
    lessons: [{
      lessonNumber: Number,
      lessonTitle: String,
      lessonContent: String,
      resources: [String],
      quiz: [{
        question: String,
        options: [String],
        correctAnswer: Number
      }]
    }]
  }],
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'default-course.jpg'
  },
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
