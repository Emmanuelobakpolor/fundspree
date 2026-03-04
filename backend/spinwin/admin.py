from django.contrib import admin
from .models import SpinResult


@admin.register(SpinResult)
class SpinResultAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'prize_label', 'prize_amount', 'spun_at']
    list_filter = ['prize_label']
    search_fields = ['user__email']
    readonly_fields = ['user', 'prize_label', 'prize_amount', 'prize_index', 'spun_at']
