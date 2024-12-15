from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        is_refresh_request = request.path.endswith("/refresh/")
        token = request.COOKIES.get("refresh_token" if is_refresh_request else "access_token")
        if token is None:
            return None
        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)
            if user.is_anonymous:  # Explicit check for anonymous user
                raise AuthenticationFailed("Token is invalid or expired.")
            elif user is None:
                raise AuthenticationFailed("No user found for this token")
            return (user, validated_token)
        except Exception as e:
            return None

