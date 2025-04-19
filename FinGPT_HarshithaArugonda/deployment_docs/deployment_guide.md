# Enhanced FinGPT Deployment Guide

This guide provides instructions for deploying the enhanced version of FinGPT, which includes new financial course and admin dashboard features.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [New Features Overview](#new-features-overview)
6. [Admin Dashboard Setup](#admin-dashboard-setup)
7. [Financial Course Management](#financial-course-management)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the application, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HarshithaAru06/FinGPT.git
   cd FinGPT
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Configuration

### Server Configuration

1. Create a `.env` file in the `server` directory with the following variables:
   ```
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/fingpt
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

   Replace the placeholder values with your actual credentials:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `OPENAI_API_KEY`: Your OpenAI API key for AI functionality

### Client Configuration

The client is pre-configured to connect to the server at `http://localhost:8080`. If you need to change this:

1. Update the API base URL in the client code where API calls are made (typically in the axios configuration or individual API calls).

## Running the Application

### Development Mode

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In a separate terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:5173` (or the port shown in your terminal).

### Production Mode

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Configure a production web server (like Nginx) to serve the static files from the `client/dist` directory.

3. Start the server:
   ```bash
   cd server
   NODE_ENV=production npm start
   ```

## New Features Overview

The enhanced FinGPT includes two major new features:

### 1. Financial Course Feature

- Course listing and filtering
- Detailed course pages
- Course enrollment functionality
- Learning interface with progress tracking
- Quiz and assessment capabilities

### 2. Admin Dashboard

- User management with role-based access control
- Course creation and management
- Analytics dashboard with user and course statistics
- Feedback management

## Admin Dashboard Setup

### Creating an Admin User

To access the admin dashboard, you need to create an admin user:

1. Register a new user through the application.
2. Access your MongoDB database and update the user's role:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Accessing the Admin Dashboard

1. Log in with the admin user credentials.
2. Navigate to `/admin` to access the dashboard.

## Financial Course Management

### Creating Courses

1. Log in as an admin user.
2. Navigate to the admin dashboard.
3. Click on "Course Management".
4. Click "Create New Course" and fill in the required information.
5. To add content to a course, click "Manage Content" after creating the course.

### Course Structure

Courses are structured with:
- Modules (sections of related content)
- Lessons (individual learning units)
- Quizzes (assessments for each lesson)

## Troubleshooting

### Server Connection Issues

- Verify MongoDB is running: `mongod --version`
- Check the MongoDB connection string in your `.env` file
- Ensure the server is running on the expected port

### Authentication Issues

- Verify JWT_SECRET is properly set in the `.env` file
- Check user credentials in the database
- Ensure token expiration is properly handled

### Admin Access Issues

- Verify the user has the "admin" role in the database
- Check the authentication middleware is properly configured
- Ensure the admin routes are protected correctly

## Support

For additional support, please contact the development team or create an issue on the GitHub repository.
