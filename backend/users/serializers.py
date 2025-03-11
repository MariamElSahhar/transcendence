from rest_framework import serializers
from .models import CustomUser
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.utils import timezone


class FriendSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ["id", "username", "avatar", "is_online", "is_friend"]

    def get_is_online(self, obj):
        obj.check_online_status()
        return obj.is_online

    def get_is_friend(self, obj):
        user = get_object_or_404(CustomUser, id=self.context.get("user_id"))
        return user in obj.friends.all()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "username",
            "password",
            "email_otp",
            "enable_otp",
            "avatar",
            "friends",
            "is_online",
            "last_seen",
        ]
        extra_kwargs = {"password": {"write_only": True, "min_length": 5}}

    friends = FriendSerializer(many=True, read_only=True)
    is_online = serializers.SerializerMethodField()

    def get_is_online(self, obj):
        obj.check_online_status()
        return obj.is_online
    def validate(self, attrs):
        username = attrs.get("username")
        email = attrs.get("email")

        if CustomUser.objects.filter(username=username).exists():
            raise ValidationError({"username": "This username is already in use."})

        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError({"email": "This email is already in use."})

        return attrs


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            raise ValidationError({"username": "Username not found."})

        if not user.check_password(password):
            raise ValidationError({"password": "Incorrect password."})

        attrs["user"] = user
        return attrs


class OTPVerificationSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    otp = serializers.CharField(required=True, write_only=True, max_length=6)

    def validate(self, attrs):
        username = attrs.get("username")
        otp = attrs.get("otp")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"username": "User not found."})

        if user.email_otp != otp:
            raise serializers.ValidationError({"otp": "Invalid OTP."})

        # Check OTP expiration (5 minutes)
        otp_age = timezone.now() - user.otp_created_at
        if otp_age.total_seconds() > 300:
            raise serializers.ValidationError({"otp": "OTP has expired."})

        attrs["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ["id", "username", "avatar", "is_online", "enable_otp", "email"]

    def get_is_online(self, obj):
        obj.check_online_status()
        return obj.is_online
