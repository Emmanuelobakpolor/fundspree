from django.urls import path
from .views import UserLoansView, AdminLoansView, AdminLoanActionView

urlpatterns = [
    path('', UserLoansView.as_view()),
    path('admin/loans/', AdminLoansView.as_view()),
    path('admin/loans/<int:loan_id>/action/', AdminLoanActionView.as_view()),
]
