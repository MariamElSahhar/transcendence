from rest_framework import serializers
from .models import CustomUser
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "username",
            "password",
            "email_otp",
            "is_email_verified",
        ]
        extra_kwargs = {"password": {"write_only": True, "min_length": 5}}

    def validate(self, attrs):
        if CustomUser.objects.filter(username=attrs["username"]).exists():
            raise ValidationError({"username": "This username is already taken."})

        if CustomUser.objects.filter(email=attrs["email"]).exists():
            raise ValidationError({"email": "This email is already in use."})

        return attrs


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    otp = serializers.CharField(required=False, write_only=True, max_length=6)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        otp = attrs.get("otp")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            raise ValidationError({"username": "User not found."})

        if not user.check_password(password):
            raise ValidationError({"password": "Incorrect password."})

        # Skip OTP validation for admin users
        if not user.is_staff:
            if not otp:
                raise ValidationError({"otp": "This field is required."})
            if user.email_otp != otp:
                raise ValidationError({"otp": "Invalid OTP."})

        attrs["user"] = user
        return attrs
