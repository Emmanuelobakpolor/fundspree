from django.urls import path
from .views import UserOrdersView, UserActiveCardsView, AdminOrdersView, AdminOrderDetailView, AdminOrderActionView

urlpatterns = [
    path('orders/', UserOrdersView.as_view()),
    path('cards/', UserActiveCardsView.as_view()),
    path('admin/orders/', AdminOrdersView.as_view()),
    path('admin/orders/<int:order_id>/', AdminOrderDetailView.as_view()),
    path('admin/orders/<int:order_id>/action/', AdminOrderActionView.as_view()),
]
