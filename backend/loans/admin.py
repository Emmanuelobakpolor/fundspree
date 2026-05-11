from django.contrib import admin
from .models import LoanApplication


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'tier', 'status', 'applied_at']
    list_filter = ['status', 'tier']
    search_fields = ['user__email']
