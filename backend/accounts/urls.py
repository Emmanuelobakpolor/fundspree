from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, MeView, ProfileView,
    PendingUsersView, ApproveUserView, AdminFundUserView, AllUsersView,
    KYCSubmitView, AdminKYCListView, AdminKYCActionView, AvatarUploadView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('profile/', ProfileView.as_view(), name='auth-profile'),
    # KYC
    path('kyc/', KYCSubmitView.as_view(), name='kyc-submit'),
    path('avatar/', AvatarUploadView.as_view(), name='auth-avatar'),
    # Admin-only user management
    path('admin/users/', AllUsersView.as_view(), name='auth-all-users'),
    path('admin/kyc/', AdminKYCListView.as_view(), name='admin-kyc-list'),
    path('admin/kyc/<int:submission_id>/action/', AdminKYCActionView.as_view(), name='admin-kyc-action'),
    path('pending-users/', PendingUsersView.as_view(), name='auth-pending-users'),
    path('users/<int:user_id>/action/', ApproveUserView.as_view(), name='auth-user-action'),
    path('users/<int:user_id>/fund/', AdminFundUserView.as_view(), name='auth-user-fund'),
]
