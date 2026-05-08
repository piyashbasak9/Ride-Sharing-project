from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .models import Token, Request, Connection

User = get_user_model()

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    model = User
    list_display = ('email', 'name', 'phone_number', 'is_staff', 'is_active', 'email_verified')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'email_verified')
    search_fields = ('email', 'name', 'phone_number')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'phone_number', 'profile_picture', 'nid_card_picture', 'address', 'bio')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Email', {'fields': ('email_verified',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone_number', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'email_verified'),
        }),
    )
    filter_horizontal = ('groups', 'user_permissions',)

@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'vehicle_type', 'status', 'created_at')
    list_filter = ('vehicle_type', 'status')
    search_fields = ('title', 'user__email', 'additional_info')

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_token', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('from_user__email', 'to_token__title')

@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'token', 'created_at')
    search_fields = ('user1__email', 'user2__email', 'token__title')
