from django.contrib import admin
from .models import CardOrder


@admin.register(CardOrder)
class CardOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'tier', 'status', 'submitted_at']
    list_filter = ['status', 'tier']
    search_fields = ['user__email', 'card_holder']
