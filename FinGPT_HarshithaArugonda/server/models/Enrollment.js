const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number, // percentage completed
    default: 0
  },
  completedLessons: [{
    moduleId: Number,
    lessonId: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizScores: [{
    moduleId: Number,
    lessonId: Number,
    score: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  certificateIssued: {
    type: Boolean,
    default: false
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  lastAccessedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
