"""
Django admin customization.
"""
# admin user
# admin - admin@42.ae - weakpass123

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    """Define the admin pages for users."""

    ordering = ["id"]
    list_display = ["email", "username"]
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        (
            ("Permissions"),
            {
                "fields": (
                    "is_email_verified",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        (("Important dates"), {"fields": ("last_login",)}),
    )
    readonly_fields = ["last_login"]
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


admin.site.register(CustomUser, CustomUserAdmin)
