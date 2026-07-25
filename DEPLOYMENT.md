# Deployment Guide - InterviewAI

This guide will help you deploy InterviewAI to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account
- Render account
- MongoDB Atlas account
- API keys for OpenAI, Groq, Google AI
- Cloudinary account

## Backend Deployment (Render)

### 1. Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string (MongoDB URI)
6. Whitelist IP addresses (0.0.0.0/0 for Render)

### 2. Set up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret

### 3. Prepare Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/interviewai
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
COOKIE_SECRET=your_cookie_secret_here
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-frontend.vercel.app
```

### 4. Deploy to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select the `server` directory (or configure root directory)
6. Use the `render.yaml` file for configuration
7. Add all environment variables from the Environment Variables section
8. Click "Deploy Web Service"
9. Wait for deployment to complete
10. Copy your Render URL (e.g., `https://interviewai-server.onrender.com`)

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables

In Vercel, you'll need to set:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://interviewai-server.onrender.com`)

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your Vercel URL (e.g., `https://interviewai.vercel.app`)

### 3. Update Backend CORS

After getting your Vercel URL, update your backend CORS configuration:

1. Go to your Render dashboard
2. Find your service
3. Update the `FRONTEND_URL` environment variable with your Vercel URL
4. Redeploy the service

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test resume creation and editing
- [ ] Test file uploads (Cloudinary)
- [ ] Test AI features (OpenAI, Groq, Google AI)
- [ ] Test email functionality
- [ ] Verify MongoDB connection
- [ ] Check API endpoints are accessible
- [ ] Test responsive design on mobile
- [ ] Verify SSL certificates are working

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**API Key Errors**
- Verify all API keys are set in environment variables
- Check API keys are valid and not expired

**CORS Issues**
- Ensure FRONTEND_URL matches your Vercel domain exactly
- Check CORS middleware configuration

### Frontend Issues

**API Connection Error**
- Verify VITE_API_URL is set correctly
- Check backend is running and accessible
- Ensure no firewall is blocking requests

**Build Errors**
- Clear Vercel cache
- Check all dependencies are installed
- Verify build command is correct

## Monitoring

### Render
- View logs in Render dashboard
- Set up error monitoring
- Check metrics for performance

### Vercel
- View deployment logs
- Monitor build times
- Check analytics

## Scaling

### Backend (Render)
- Upgrade to paid tier for better performance
- Add Redis for session management
- Implement load balancing

### Frontend (Vercel)
- Vercel automatically scales
- Enable edge functions for better performance
- Use CDN for static assets

## Security

- Keep all API keys secure
- Use environment variables for sensitive data
- Enable HTTPS (automatic on Vercel and Render)
- Implement rate limiting
- Regular security audits
- Keep dependencies updated

## Backup

- MongoDB Atlas provides automated backups
- Regular database exports
- Version control with Git
- Environment variable management

## Support

For issues:
- Check Render and Vercel status pages
- Review logs in respective dashboards
- Consult documentation:
  - [Render Docs](https://render.com/docs)
  - [Vercel Docs](https://vercel.com/docs)
  - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
