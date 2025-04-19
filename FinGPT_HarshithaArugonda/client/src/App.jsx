import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import FinancialGlossary from './pages/FinancialGlossary';
import UserFeedback from './pages/UserFeedback';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import CourseLearnPage from './pages/courses/CourseLearnPage';
import MyCoursesPage from './pages/courses/MyCoursesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import FinancialDashboard from './pages/FinancialDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/financial-glossary" element={<FinancialGlossary />} />
            <Route path="/feedback" element={<UserFeedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            
            {/* Course Routes */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:id/learn" element={<CourseLearnPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            
            {/* Financial Tools */}
            <Route path="/financial-tools" element={<FinancialDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
