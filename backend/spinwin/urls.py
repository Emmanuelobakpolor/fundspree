from django.urls import path
from .views import UserSpinStatusView, UserSpinView, SpinLeaderboardView, AdminSpinResultsView

urlpatterns = [
    path('status/', UserSpinStatusView.as_view()),
    path('spin/', UserSpinView.as_view()),
    path('leaderboard/', SpinLeaderboardView.as_view()),
    path('admin/results/', AdminSpinResultsView.as_view()),
]
