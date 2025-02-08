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
                    "is_superuser",
                    "is_staff",
                    "enable_otp",
                    "is_online",
                )
            },
        ),
        (("Important dates"), {"fields": ("last_login",)}),
    )
    readonly_fields = ["last_login", "is_email_verified"]
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
                    "is_staff",
                    "enable_otp",
                ),
            },
        ),
    )


admin.site.register(CustomUser, CustomUserAdmin)
