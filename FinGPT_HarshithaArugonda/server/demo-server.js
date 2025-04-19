const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Sample user data with admin credentials
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'arshetty304@gmail.com',
    password: 'ashish', // In a real app, this would be hashed
    role: 'admin'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Sample course data
const courses = [
  {
    id: '1',
    title: 'Introduction to Personal Finance',
    description: 'This comprehensive course introduces the fundamentals of personal finance management. Students will learn essential skills for budgeting, saving, investing, and planning for financial goals.',
    instructor: 'Dr. Sarah Johnson',
    level: 'Beginner',
    duration: '8 hours',
    image: '/assets/images/personal-finance.jpg',
    price: 0,
    rating: 4.8,
    enrollments: 1250,
    modules: [
      {
        title: 'Financial Foundations',
        lessons: [
          { title: 'Understanding Income and Expenses', duration: '45 min' },
          { title: 'Creating Your First Budget', duration: '60 min' },
          { title: 'Emergency Funds and Financial Safety Nets', duration: '45 min' }
        ],
        quiz: { title: 'Financial Foundations Assessment', questions: 10 }
      },
      {
        title: 'Smart Saving Strategies',
        lessons: [
          { title: 'Setting Effective Savings Goals', duration: '45 min' },
          { title: 'High-Yield Savings Accounts and CDs', duration: '60 min' },
          { title: 'Automating Your Savings', duration: '45 min' }
        ],
        quiz: { title: 'Savings Strategy Challenge', questions: 8 }
      },
      {
        title: 'Debt Management',
        lessons: [
          { title: 'Understanding Good vs. Bad Debt', duration: '45 min' },
          { title: 'Effective Debt Repayment Strategies', duration: '60 min' },
          { title: 'Improving Your Credit Score', duration: '45 min' }
        ],
        quiz: { title: 'Debt Management Mastery Test', questions: 10 }
      },
      {
        title: 'Introduction to Investing',
        lessons: [
          { title: 'Investment Basics and Risk Tolerance', duration: '45 min' },
          { title: 'Stocks, Bonds, and Mutual Funds', duration: '60 min' },
          { title: 'Retirement Accounts (401k, IRA)', duration: '45 min' }
        ],
        quiz: { title: 'Investment Fundamentals Exam', questions: 12 }
      }
    ]
  },
  {
    id: '2',
    title: 'Investment Strategies for Wealth Building',
    description: 'This intermediate-level course explores various investment strategies for long-term wealth building. Students will learn how to create a diversified portfolio, analyze investment opportunities, and develop strategies for different market conditions.',
    instructor: 'Prof. Michael Chen, CFA',
    level: 'Intermediate',
    duration: '10 hours',
    image: '/assets/images/investment-strategies.jpg',
    price: 0,
    rating: 4.7,
    enrollments: 850,
    modules: [
      {
        title: 'Investment Fundamentals Review',
        lessons: [
          { title: 'Asset Classes and Their Characteristics', duration: '45 min' },
          { title: 'Risk Management and Diversification', duration: '60 min' },
          { title: 'Understanding Market Cycles', duration: '45 min' }
        ],
        quiz: { title: 'Investment Fundamentals Assessment', questions: 10 }
      },
      {
        title: 'Portfolio Construction',
        lessons: [
          { title: 'Asset Allocation Strategies', duration: '45 min' },
          { title: 'Modern Portfolio Theory', duration: '60 min' },
          { title: 'Creating Your Investment Policy Statement', duration: '45 min' }
        ],
        quiz: { title: 'Portfolio Construction Challenge', questions: 8 }
      },
      {
        title: 'Stock Investment Strategies',
        lessons: [
          { title: 'Fundamental Analysis', duration: '45 min' },
          { title: 'Technical Analysis', duration: '60 min' },
          { title: 'Value vs. Growth Investing', duration: '45 min' }
        ],
        quiz: { title: 'Stock Analysis Mastery Test', questions: 10 }
      },
      {
        title: 'Advanced Investment Vehicles',
        lessons: [
          { title: 'ETFs and Index Investing', duration: '45 min' },
          { title: 'Real Estate Investment Trusts (REITs)', duration: '60 min' },
          { title: 'Alternative Investments', duration: '45 min' }
        ],
        quiz: { title: 'Advanced Investment Vehicles Exam', questions: 12 }
      }
    ]
  },
  {
    id: '3',
    title: 'Financial Planning for Life Milestones',
    description: 'This comprehensive course guides students through financial planning for major life events and milestones. Students will learn how to prepare financially for education, home buying, family planning, retirement, and estate planning.',
    instructor: 'Dr. Emily Rodriguez, CFP',
    level: 'Advanced',
    duration: '12 hours',
    image: '/assets/images/financial-planning.jpg',
    price: 0,
    rating: 4.9,
    enrollments: 620,
    modules: [
      {
        title: 'Education Planning',
        lessons: [
          { title: 'Saving for College (529 Plans and Alternatives)', duration: '45 min' },
          { title: 'Student Loan Management', duration: '60 min' },
          { title: 'Continuing Education and Career Development Funding', duration: '45 min' }
        ],
        quiz: { title: 'Education Funding Assessment', questions: 10 }
      },
      {
        title: 'Home Buying and Real Estate',
        lessons: [
          { title: 'Preparing for Homeownership', duration: '45 min' },
          { title: 'Mortgage Options and Strategies', duration: '60 min' },
          { title: 'Real Estate as an Investment', duration: '45 min' }
        ],
        quiz: { title: 'Real Estate Planning Challenge', questions: 8 }
      },
      {
        title: 'Family Financial Planning',
        lessons: [
          { title: 'Marriage and Financial Merging', duration: '45 min' },
          { title: 'Planning for Children', duration: '60 min' },
          { title: 'Insurance and Protection Planning', duration: '45 min' }
        ],
        quiz: { title: 'Family Finance Mastery Test', questions: 10 }
      },
      {
        title: 'Retirement and Estate Planning',
        lessons: [
          { title: 'Comprehensive Retirement Strategy', duration: '45 min' },
          { title: 'Social Security Optimization', duration: '60 min' },
          { title: 'Estate Planning and Wealth Transfer', duration: '45 min' }
        ],
        quiz: { title: 'Retirement and Estate Planning Exam', questions: 12 }
      }
    ]
  }
];

// Sample enrollments data
const enrollments = [
  {
    id: '1',
    userId: '2',
    courseId: '1',
    enrollmentDate: '2025-03-15',
    progress: 35,
    completedLessons: ['1-1', '1-2', '1-3', '2-1'],
    completedQuizzes: ['1']
  }
];

// API Routes

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // In a real app, you would generate a JWT token here
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: 'demo-token-' + user.id
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// User routes
app.get('/api/users', (req, res) => {
  // In a real app, you would verify the token and check admin role
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  }));
  
  res.json({ success: true, users: safeUsers });
});

// Course routes
app.get('/api/courses', (req, res) => {
  res.json({ success: true, courses });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  
  if (course) {
    res.json({ success: true, course });
  } else {
    res.status(404).json({ success: false, message: 'Course not found' });
  }
});

// Enrollment routes
app.get('/api/enrollments/user/:userId', (req, res) => {
  const userEnrollments = enrollments.filter(e => e.userId === req.params.userId);
  
  if (userEnrollments.length > 0) {
    const enrolledCourses = userEnrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return {
        ...enrollment,
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          level: course.level,
          image: course.image
        }
      };
    });
    
    res.json({ success: true, enrollments: enrolledCourses });
  } else {
    res.json({ success: true, enrollments: [] });
  }
});

app.post('/api/enrollments', (req, res) => {
  const { userId, courseId } = req.body;
  
  // Check if already enrolled
  const existingEnrollment = enrollments.find(
    e => e.userId === userId && e.courseId === courseId
  );
  
  if (existingEnrollment) {
    return res.status(400).json({ 
      success: false, 
      message: 'User already enrolled in this course' 
    });
  }
  
  // Create new enrollment
  const newEnrollment = {
    id: (enrollments.length + 1).toString(),
    userId,
    courseId,
    enrollmentDate: new Date().toISOString().split('T')[0],
    progress: 0,
    completedLessons: [],
    completedQuizzes: []
  };
  
  enrollments.push(newEnrollment);
  
  res.json({ success: true, enrollment: newEnrollment });
});

// Admin routes
app.get('/api/admin/stats', (req, res) => {
  // In a real app, you would verify the token and check admin role
  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    totalEnrollments: enrollments.length,
    recentEnrollments: enrollments.slice(-5),
    coursePopularity: courses.map(c => ({
      id: c.id,
      title: c.title,
      enrollments: enrollments.filter(e => e.courseId === c.id).length
    }))
  };
  
  res.json({ success: true, stats });
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo mode active with admin credentials:`);
  console.log(`Email: arshetty304@gmail.com`);
  console.log(`Password: ashish`);
});
