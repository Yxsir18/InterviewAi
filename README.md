# InterviewAI - AI-Powered Interview Platform

A production-ready, full-stack AI interview platform built with the MERN stack. This platform enables candidates to practice technical interviews with AI-generated questions, receive detailed performance analysis, and track their progress over time.

## 🚀 Features

### For Candidates
- **AI-Generated Interviews**: Unique questions tailored to your resume and selected role
- **Multiple Interview Types**: HR, MERN Stack, React, Node.js, JavaScript, SQL, Python, Java, DevOps, System Design, Data Structures
- **Difficulty Levels**: Easy, Medium, Hard
- **Voice-to-Text**: Browser Speech Recognition API for hands-free answering
- **AI Evaluation**: Detailed feedback on technical accuracy, communication, confidence, completeness, grammar, and best practices
- **Performance Reports**: Comprehensive analysis with strengths, weaknesses, and improvement roadmap
- **Resume Parsing**: Upload PDF/DOCX resumes to extract skills and personalize interviews
- **Analytics Dashboard**: Track progress with charts and metrics
- **Bookmarks**: Save difficult questions for later review
- **Personal Notes**: Take notes after interviews
- **Certificates**: Earn certificates for scoring 70% or higher
- **Interview History**: View and retake past interviews

### For Admins
- **User Management**: View, activate/deactivate, and delete users
- **Analytics Dashboard**: Platform-wide metrics and insights
- **Interview Monitoring**: Track interview completion rates and performance
- **Certificate Management**: Verify and manage issued certificates

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Chart.js** - Data visualization
- **React Icons** - Icon library
- **jsPDF** - PDF generation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Cloud storage
- **Nodemailer** - Email service
- **OpenAI API** - AI integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- OpenAI API Key
- Cloudinary Account (for file storage)
- Gmail Account (for email verification)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd InterviewAi
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/interviewai

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_change_in_production
REFRESH_TOKEN_EXPIRE=30d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@interviewai.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 4. Frontend Setup

```bash
cd client
npm install
```

### 5. Start MongoDB

Make sure MongoDB is running on your machine:

```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
# or
mongod
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
InterviewAi/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🔐 Authentication

The platform uses JWT-based authentication with refresh tokens:

- **Access Token**: Short-lived (7 days) for API requests
- **Refresh Token**: Long-lived (30 days) for token renewal
- **Email Verification**: Required for full access
- **Password Reset**: Via email with secure tokens

## 🤖 AI Integration

The platform uses OpenAI's GPT-4 for:

1. **Question Generation**: Creates unique interview questions based on:
   - User's resume (skills, experience, technologies)
   - Selected interview type
   - Difficulty level
   - Number of questions

2. **Answer Evaluation**: Analyzes responses for:
   - Technical accuracy
   - Communication skills
   - Confidence level
   - Completeness
   - Grammar
   - Best practices

3. **Performance Analysis**: Generates:
   - Detailed feedback
   - Improvement suggestions
   - Learning recommendations

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern glass-like UI elements
- **Dark Theme**: Professional dark color scheme
- **Responsive Layout**: Mobile-friendly design
- **Smooth Animations**: Framer Motion animations
- **Interactive Charts**: Chart.js for data visualization
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: React Hot Toast for feedback

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Express-validator
- **XSS Protection**: Input sanitization
- **MongoDB Injection Protection**: Mongoose sanitization

## 📊 Database Schema

### Collections
- **users**: User accounts and authentication
- **profiles**: User profile information
- **resumes**: Uploaded resumes and parsed data
- **interviews**: Interview sessions
- **questions**: Generated questions
- **reports**: Interview performance reports
- **certificates**: Achievement certificates
- **bookmarks**: Saved questions
- **notes**: Personal notes
- **notifications**: User notifications
- **settings**: User preferences

## 🚀 Deployment

### Backend Deployment (e.g., Render, Heroku)

1. Set environment variables in the deployment platform
2. Deploy the `server` directory
3. Ensure MongoDB is hosted (MongoDB Atlas recommended)
4. Configure Cloudinary for production

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` directory
3. Set API URL to production backend
4. Configure environment variables

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📝 Environment Setup Guide

### Gmail App Password

1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an app password for email sending
4. Use this password in `EMAIL_PASSWORD`

### Cloudinary Setup

1. Sign up at cloudinary.com
2. Create a new cloud
3. Copy credentials to `.env` file

### OpenAI API Key

1. Sign up at platform.openai.com
2. Generate an API key
3. Add to `.env` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Chart.js for data visualization
- Framer Motion for animations
- Tailwind CSS for styling

## 📧 Support

For support, email support@interviewai.com or open an issue in the repository.

## 🗺️ Roadmap

### Future Features
- [ ] Live AI Voice Interview with real-time feedback
- [ ] Webcam Analysis for body language
- [ ] Eye Contact Detection
- [ ] Emotion Detection during interviews
- [ ] Coding Interview Compiler
- [ ] Live Code Execution
- [ ] Company-specific Interview Modes (Google, Microsoft, Amazon, Meta, Netflix)
- [ ] Recruiter Dashboard
- [ ] Team Mock Interviews
- [ ] Interview Leaderboard
- [ ] Subscription Plans
- [ ] AI Resume Builder
- [ ] Personalized Learning Paths
- [ ] Mobile App (React Native)

## 📞 Contact

- Website: https://interviewai.com
- Email: support@interviewai.com
- Twitter: @interviewai

---

**Built with ❤️ using MERN Stack**
