# Deployment Guide: Fundspree Backend to Render + PostgreSQL + Cloudinary

## Prerequisites
- Render account (https://render.com)
- Cloudinary account (https://cloudinary.com)
- Git repository with your project

## Step 1: Set up Cloudinary
1. Log in to Cloudinary
2. Go to Dashboard → Account Details
3. Note down your:
   - Cloud Name
   - API Key
   - API Secret (click "View" to reveal)

## Step 2: Create a PostgreSQL Database on Render
1. Log in to Render
2. Go to "Dashboard" → "New" → "PostgreSQL"
3. Fill in the form:
   - Name: fundspree-db
   - Database Name: fundspree
   - User: fundspree
   - Plan: Free
4. Click "Create Database"
5. Wait for the database to be provisioned (~1-2 minutes)
6. Note down the connection details (Host, Port, Database, User, Password)

## Step 3: Deploy the Backend Service on Render
1. Go to "Dashboard" → "New" → "Web Service"
2. Connect your GitHub/GitLab repository
3. Fill in the form:
   - Name: fundspree-backend
   - Environment: Python 3.11
   - Build Command: `pip install -r backend/requirements.txt && python backend/manage.py collectstatic --noinput`
   - Start Command: `gunicorn --chdir backend config.wsgi:application`
4. Under "Environment Variables", add:
   ```
   SECRET_KEY: [generate a random secret key]
   DEBUG: False
   ALLOWED_HOSTS: *.onrender.com
   CORS_ALLOWED_ORIGINS: https://your-frontend-domain.com
   DB_ENGINE: django.db.backends.postgresql
   DB_NAME: [from Step 2]
   DB_USER: [from Step 2]
   DB_PASSWORD: [from Step 2]
   DB_HOST: [from Step 2]
   DB_PORT: 5432
   CLOUDINARY_CLOUD_NAME: [from Step 1]
   CLOUDINARY_API_KEY: [from Step 1]
   CLOUDINARY_API_SECRET: [from Step 1]
   ```
5. Click "Deploy"
6. Wait for the deployment to complete (~5-10 minutes)

## Step 4: Run Database Migrations
1. Once the backend service is deployed, go to "Shell" tab
2. Run the migrations:
   ```bash
   python backend/manage.py migrate
   ```
3. Create a superuser (for Django admin):
   ```bash
   python backend/manage.py createsuperuser
   ```

## Step 5: Verify Deployment
1. Check the "Logs" tab for any errors
2. Visit your backend URL: `https://fundspree-backend.onrender.com`
3. Try accessing the admin panel: `https://fundspree-backend.onrender.com/admin/`
4. Log in with the superuser credentials created in Step 4

## Step 6: Update Frontend API Base URL
1. In your frontend code, update the API base URL to:
   ```typescript
   const API_BASE_URL = 'https://fundspree-backend.onrender.com/api';
   ```
2. Redeploy your frontend

## Step 7: Test Image Upload
1. Log in to your frontend application
2. Go to profile settings
3. Upload a profile picture
4. Check if the image is correctly stored and displayed (should be a Cloudinary URL)

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Check your DB environment variables are correctly set
2. **Static Files Not Loading**: Make sure collectstatic is running in the build process
3. **CORS Errors**: Verify the CORS_ALLOWED_ORIGINS variable includes your frontend URL
4. **Image Upload Failures**: Check Cloudinary credentials are correct

### Logs
- Backend logs: Render dashboard → fundspree-backend → Logs
- Database logs: Render dashboard → fundspree-db → Logs

## Performance Tips
- For production, consider upgrading to a paid Render plan for better performance
- Enable CDN for static files
- Configure caching for images

## Backup and Monitoring
- Render automatically backs up PostgreSQL databases
- Set up alerts for service downtime
- Monitor API response times

## Updating the Backend
1. Push changes to your Git repository
2. Render will automatically redeploy the service
3. Run migrations if needed:
   ```bash
   python backend/manage.py migrate
   ```
