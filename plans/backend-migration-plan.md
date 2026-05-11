# Backend Migration Plan: Next.js Frontend to Django Backend

## Project Overview
- **Current Frontend**: Next.js 16 + TypeScript
- **New Backend**: Django 6.0 + Django REST Framework
- **Authentication System**: Custom user model with admin approval workflow

## Current Authentication Flow Analysis

**Frontend Current State**:
- Authentication uses localStorage for user storage
- Registration: Stores user data in localStorage
- Login: Verifies credentials against localStorage
- Verification: Static page with WhatsApp contact for activation
- Admin Panel: Manages card orders (localStorage based)

**Required Backend Features**:
1. User registration with activation status
2. User login with authentication tokens
3. Admin approval endpoint for user activation
4. Verification status check endpoint
5. Secure token-based authentication

## Migration Plan

### Phase 1: Django Backend Setup

#### 1.1 Create Authentication App
- Create new Django app `authentication`
- Configure in `settings.py`

#### 1.2 Custom User Model
- Extend Django's AbstractUser model
- Add `is_approved` field (boolean)
- Set default `is_approved=False`
- Configure as default auth user model

#### 1.3 Django REST Framework Configuration
- Install and configure DRF
- Set up authentication classes (TokenAuthentication)
- Configure permissions

### Phase 2: API Endpoints

#### 2.1 User Registration
- **Endpoint**: `POST /api/auth/register/`
- **Payload**: `{ name, email, password }`
- **Response**: `{ user: { id, name, email, is_approved }, token }`
- **Logic**: Create user with `is_approved=False`, generate authentication token

#### 2.2 User Login
- **Endpoint**: `POST /api/auth/login/`
- **Payload**: `{ email, password }`
- **Response**: `{ user: { id, name, email, is_approved }, token }`
- **Logic**: Verify credentials, check if user is approved, return token

#### 2.3 User Logout
- **Endpoint**: `POST /api/auth/logout/`
- **Headers**: `Authorization: Token <token>`
- **Response**: `{ message: "Logout successful" }`
- **Logic**: Delete authentication token

#### 2.4 Verify User Status
- **Endpoint**: `GET /api/auth/status/`
- **Headers**: `Authorization: Token <token>`
- **Response**: `{ user: { id, name, email, is_approved } }`
- **Logic**: Return current user's details and approval status

#### 2.5 Admin Approval
- **Endpoint**: `POST /api/admin/approve-user/`
- **Payload**: `{ user_id }`
- **Headers**: `Authorization: Token <token>` (admin only)
- **Response**: `{ message: "User approved successfully" }`
- **Logic**: Set `is_approved=True` for specified user

### Phase 3: Frontend Updates

#### 3.1 AuthContext.tsx
- Replace localStorage with API calls
- Manage authentication token in state
- Handle token expiration
- Add loading and error states

#### 3.2 AuthModal.tsx
- Update login/register handlers to use API endpoints
- Show error messages from API responses
- Add loading indicators during API calls

#### 3.3 VerificationStatus.tsx
- Fetch real verification status from backend
- Display dynamic content based on `is_approved` value
- Add refresh functionality

#### 3.4 API Service Layer
- Create a separate service file for API calls
- Handle HTTP requests and responses
- Implement error handling

### Phase 4: Admin Panel Integration

#### 4.1 Admin API Endpoints
- Fetch users awaiting approval
- Implement user approval functionality
- Add user management features

#### 4.2 Admin Page Updates
- Replace localStorage with API calls
- Display real user data and approval status
- Add approval/rejection functionality

### Phase 5: Security & Configuration

#### 5.1 CORS Configuration
- Install and configure `django-cors-headers`
- Allow frontend origin for API requests

#### 5.2 Authentication Tokens
- Implement secure token storage on frontend
- Add token refresh mechanism
- Set appropriate CORS headers

#### 5.3 Environment Variables
- Move sensitive settings to environment variables
- Configure production settings

## Technology Stack

**Backend**:
- Django 6.0
- Django REST Framework
- Django CORS Headers
- SQLite (development), PostgreSQL (production)

**Frontend**:
- Next.js 16
- TypeScript
- Axios or Fetch API

## Testing Strategy

1. **Unit Tests**: Test API endpoints with Django test framework
2. **Integration Tests**: Test complete login/registration flow
3. **End-to-End Tests**: Test frontend-backend integration
4. **Security Tests**: Test authentication token handling

## Deployment Considerations

- Use environment variables for configuration
- Set up proper CORS configuration
- Implement HTTPS
- Consider using Django's built-in admin for user management

## Timeline

1. **Phase 1**: 2-3 days
2. **Phase 2**: 3-4 days
3. **Phase 3**: 2-3 days
4. **Phase 4**: 2-3 days
5. **Phase 5**: 1-2 days
6. **Testing**: 2-3 days

## Risks & Mitigation

- **Data Migration**: No existing backend, so no data migration needed
- **CORS Issues**: Proper configuration of cors-headers package
- **Authentication Token Security**: Implement secure storage and refresh mechanism
- **Error Handling**: Comprehensive error handling in both frontend and backend
