from django.urls import path
from .views import WithdrawalView, AdminWithdrawalView

urlpatterns = [
    path('', WithdrawalView.as_view(), name='withdrawal-list-create'),
    path('admin/', AdminWithdrawalView.as_view(), name='admin-withdrawal-list'),
]
