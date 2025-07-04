# Contributing to Class Management System

We welcome contributions to the Class Management System! This guide will help you understand the project structure, coding standards, and contribution process.

## 📋 Table of Contents

- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Coding Standards](#coding-standards)
- [Development Guidelines](#development-guidelines)
- [Authentication & Authorization](#authentication--authorization)
- [API Development](#api-development)
- [Frontend Development](#frontend-development)
- [File Upload Guidelines](#file-upload-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)

## 🏗️ Project Architecture

This is a MERN stack application with **decoupled frontend and backend** architecture:

```
ClassMgmtSysOS-/
├── backend-classmgmt/          # Node.js/Express.js backend
├── frontend-classmgmt/         # React.js frontend
├── README.md
├── .gitignore
└── CONTRIBUTING.md
```

### Backend Structure
```
backend-classmgmt/
├── controllers/        # Route handlers
├── models/            # MongoDB schemas
├── routes/            # API route definitions
├── middleware/        # Authentication & validation
├── dtos/             # Data Transfer Objects
├── utils/            # Utility functions
├── services/         # Business logic
├── config/           # Configuration files
└── app.js            # Main application file
```

### Frontend Structure
```
frontend-classmgmt/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-specific components
│   ├── context/       # React Context (Auth, etc.)
│   ├── utils/         # Utility functions
│   ├── services/      # API service functions
│   ├── assets/        # Static assets
│   └── App.jsx        # Main app component
├── public/
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git
- Firebase account (for authentication)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShudarsanRegmi/ClassMgmtSysOS-.git
   cd ClassMgmtSysOS-
   ```

2. **Backend Setup:**
   ```bash
   cd backend-classmgmt
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend-classmgmt
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

## 📝 Coding Standards

### General Guidelines

- **No tight coupling** between frontend and backend
- Follow **RESTful API** conventions
- Use **meaningful variable and function names**
- Write **clear, concise comments** for complex logic
- Maintain **consistent code formatting**
- Follow the **DRY principle** (Don't Repeat Yourself)

### JavaScript/Node.js Standards

- Use **ES6+** syntax (const, let, arrow functions, destructuring)
- Use **async/await** for asynchronous operations
- Handle errors properly with try-catch blocks
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and components
- Use **kebab-case** for file names

### React Standards

- Use **functional components** with hooks
- Use **React Context** for global state management
- Keep components **small and focused**
- Follow React naming conventions
- Use **JSX** syntax consistently

## 🔐 Authentication & Authorization

### Firebase Authentication
- User authentication is managed by **Firebase**
- User profile data is stored in **MongoDB**
- Use the **AuthContext** for centralized user state management

#### Frontend Authentication
```javascript
// Always use AuthContext for user data
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, userProfile } = useAuth();
  // Use currentUser for Firebase data
  // Use userProfile for MongoDB profile data
}
```

#### Backend Authentication
```javascript
// Use the verifyToken middleware for protected routes
const verifyToken = require('../middleware/authmiddleware');

router.get('/protected-route', verifyToken, (req, res) => {
  // req.user contains the decoded Firebase token
  const userId = req.user.uid;
});
```

## 🌐 API Development

### API Structure
- Base URL: `http://localhost:3001/api`
- All API endpoints should be prefixed with `/api`
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON responses

### Request/Response Format
```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### API Interceptor Usage
```javascript
// Always use the API interceptor for backend requests
import api from '../utils/api';

// The interceptor automatically adds Bearer token
const response = await api.get('/endpoint');
const data = await api.post('/endpoint', payload);
```

### Data Transfer Objects (DTOs)
- Use DTOs for data filtering before sending to frontend
- Located in `backend-classmgmt/dtos/`
- Example:
```javascript
// dtos/user.dto.js
function userProfileDto(user) {
  return {
    _id: user._id,
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role,
    // Filter out sensitive data
  };
}
```

## 🎨 Frontend Development

### UI Component Library
- **Material-UI (MUI)** for components
- **Tailwind CSS** for styling
- **React Icons** and **Lucide React** for icons
- **Framer Motion** for animations

### Component Organization
```
src/
├── components/     # Reusable components (broad scope)
│   ├── common/     # Common UI components
│   ├── forms/      # Form components
│   └── layout/     # Layout components
├── pages/          # Page-specific components (groupable)
│   ├── Dashboard/
│   ├── Profile/
│   └── Settings/
```

### State Management
- Use **React Context** for global state
- Use **useState** and **useEffect** for component state
- **AuthContext** for authentication state
- Custom hooks for reusable logic

### Styling Guidelines
- Use **MUI theme** for consistent styling
- Use **Tailwind classes** for utility styling
- Keep styles component-specific
- Use **responsive design** principles

## 📁 File Upload Guidelines

### Cloudinary Integration
- All file uploads must use the **Cloudinary uploader**
- Located at `backend-classmgmt/utils/cloudinaryUploader.js`

```javascript
// Example usage
const uploadToCloudinary = require('../utils/cloudinaryUploader');

const handleFileUpload = async (filePath) => {
  try {
    const result = await uploadToCloudinary(filePath, 'folder-name');
    return result.secure_url;
  } catch (error) {
    throw new Error('File upload failed');
  }
};
```

### File Upload Middleware
- Use existing middleware in `backend-classmgmt/middleware/`
- Handle file validation and size limits
- Clean up temporary files after upload

## 🧪 Testing

### Frontend Testing
- Use **Jest** and **React Testing Library**
- Write unit tests for components
- Test user interactions and state changes
- Use **Cypress** for end-to-end testing

### Backend Testing
- Write unit tests for controllers and services
- Test API endpoints with different scenarios
- Mock external dependencies (Firebase, Cloudinary)

## 🔀 Pull Request Process

### Before Creating a PR
1. **Fork** the repository
2. Create a **feature branch** from `main`
3. Make your changes following the coding standards
4. Write/update tests if applicable
5. Test your changes thoroughly
6. Update documentation if needed

### Branch Naming Convention
```
feature/feature-name
bugfix/bug-description
hotfix/urgent-fix
chore/maintenance-task
```

### Commit Message Format
```
type(scope): description

[optinal body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(auth): add password reset functionality
fix(api): resolve user profile update issue
docs(readme): update installation instructions
```

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

## 👀 Code Review Guidelines

### For Reviewers
- Check code quality and adherence to standards
- Verify functionality and edge cases
- Ensure proper error handling
- Review security implications
- Check for performance issues
- Verify tests and documentation

### For Authors
- Respond to feedback promptly
- Make requested changes
- Explain complex decisions
- Keep PRs focused and small
- Ensure CI/CD passes

## 📚 Additional Resources


### Project-Specific Files
- `frontend-classmgmt/src/context/AuthContext.jsx` - Authentication context
- `frontend-classmgmt/src/utils/api.js` - API interceptor
- `backend-classmgmt/middleware/authmiddleware.js` - Token verification
- `backend-classmgmt/utils/cloudinaryUploader.js` - File upload utility
- `backend-classmgmt/dtos/` - Data Transfer Objects

## 🆘 Getting Help

- Create an issue for bugs or feature requests
- Join project discussions
- Check existing documentation
- Ask questions in pull requests

## 🙏 Thank You

Thank you for contributing to the Class Management System! Your efforts help make education more accessible and organized.

---

**Happy Coding!** 

