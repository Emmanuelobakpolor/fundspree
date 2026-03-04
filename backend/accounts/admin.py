from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.action(description="Approve selected users (activate accounts)")
def approve_users(modeladmin, request, queryset):
    queryset.update(is_approved=True, is_active=True)


@admin.action(description="Deactivate selected users (revoke access)")
def deactivate_users(modeladmin, request, queryset):
    queryset.update(is_active=False, is_approved=False)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    actions = [approve_users, deactivate_users]

    list_display = ('email', 'name', 'is_approved', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_approved', 'is_active', 'is_staff')
    search_fields = ('email', 'name')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('name', 'first_name', 'last_name')}),
        ('Status', {'fields': ('is_approved', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Account', {'fields': ('welcome_bonus', 'balance', 'referral_bonus', 'withdrawal_this_month', 'withdrawal_all_time')}),
        ('Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'name', 'password1', 'password2', 'is_approved', 'is_active'),
        }),
    )
