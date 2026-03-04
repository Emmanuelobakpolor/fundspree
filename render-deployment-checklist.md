# Render Deployment Checklist

## Pre-Deployment Steps
- [ ] Create Render account: https://render.com
- [ ] Create PostgreSQL database:
  - Name: fundspheredb
  - Database Name: fundspheredb
  - User: fundspheredb_user
  - Host: dpg-d6jnjaa4d50c7392vv10-a.oregon-postgres.render.com
  - Port: 5432
  - Password: JNM9vAwDufR81ZiJFzceNTLnbfpjOv80

## Deploying the Backend
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Fill in the form:
   - **Name**: fundspree-backend
   - **Environment**: Python 3.11
   - **Build Command**: `pip install -r backend/requirements.txt && python backend/manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn --chdir backend config.wsgi:application`
4. Add Environment Variables:
   ```
   SECRET_KEY: [Generate a random key]
   DEBUG: False
   ALLOWED_HOSTS: *.onrender.com
   CORS_ALLOWED_ORIGINS: http://localhost:3000,https://your-frontend-domain.com
   DB_ENGINE: django.db.backends.postgresql
   DB_NAME: fundspheredb
   DB_USER: fundspheredb_user
   DB_PASSWORD: JNM9vAwDufR81ZiJFzceNTLnbfpjOv80
   DB_HOST: dpg-d6jnjaa4d50c7392vv10-a.oregon-postgres.render.com
   DB_PORT: 5432
   CLOUDINARY_CLOUD_NAME: dw8qc3q5d
   CLOUDINARY_API_KEY: 995544599534576
   CLOUDINARY_API_SECRET: UcXkMCIJxDjLWRrWNG1x56ZGTok
   ```
5. Click "Deploy"

## Post-Deployment Steps
1. **Run Migrations**:
   - Go to the "Shell" tab in your Render service
   - Run: `python backend/manage.py migrate`
2. **Create Superuser**:
   - Run: `python backend/manage.py createsuperuser`
3. **Verify Deployment**:
   - Visit: `https://fundspree-backend.onrender.com`
   - Check the admin panel: `https://fundspree-backend.onrender.com/admin/`

## Environment Variables Explained
| Variable | Description |
|----------|-------------|
| SECRET_KEY | Django secret key (generate a random key) |
| DEBUG | Set to False in production |
| ALLOWED_HOSTS | Allow all Render domains |
| CORS_ALLOWED_ORIGINS | Allow your frontend to make API requests |
| DB_ENGINE | Database engine (PostgreSQL) |
| DB_NAME | Database name |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| DB_HOST | Database host address |
| DB_PORT | Database port (5432 for PostgreSQL) |
| CLOUDINARY_CLOUD_NAME | Your Cloudinary cloud name |
| CLOUDINARY_API_KEY | Your Cloudinary API key |
| CLOUDINARY_API_SECRET | Your Cloudinary API secret |

## Troubleshooting
- **Database Errors**: Check connection details are correct
- **Static Files**: Ensure collectstatic ran successfully
- **CORS Errors**: Verify frontend URL is in CORS_ALLOWED_ORIGINS
- **Logs**: Check the "Logs" tab in your Render service
