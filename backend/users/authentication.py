from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("access_token")

        if token is None:
            return None

        validated_token = self.get_validated_token(token)
        user = self.get_user(validated_token)

        if user is None:
            raise AuthenticationFailed("No user found for this token")

        return (user, validated_token)
