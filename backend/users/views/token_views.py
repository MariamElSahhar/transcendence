from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenVerifySerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from ..utils import set_response_cookie, update_user_activity

# REFRESH TOKEN
@api_view(["POST"])
@permission_classes([AllowAny])
def token_refresh_view(request):
    refresh_token = request.COOKIES.get("refresh_token")

    if refresh_token is None:
        return Response(
            {"error": "Refresh token not provided.", "success": False},
            status=status.HTTP_200_OK
        )

    # custom error handling here to avoid the console error on frontend
    try:
        token_serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        token_serializer.is_valid(raise_exception=True)

        tokens = token_serializer.validated_data
        response = Response(
            {"message": "Refresh successful.", "success": True}, status=status.HTTP_200_OK
        )
        response = set_response_cookie(response, tokens, None, False)
        return response

    except (TokenError, InvalidToken):
        return Response(
            {"error": "Refresh token is invalid or expired.", "success": False},
            status=status.HTTP_200_OK
        )


# TOKEN STATUS
@api_view(["GET"])
@permission_classes([AllowAny])
def token_status_view(request):
    access_token = request.COOKIES.get("access_token")

    if not access_token:
        return Response(
            {"error": "Access token not provided.", "success": False},
            status=status.HTTP_200_OK
        )

    # custom error handling here to avoid the console error on frontend
    try:
        token_serializer = TokenVerifySerializer(data={"token": access_token})
        token_serializer.is_valid(raise_exception=True)

        if request.user and request.user.is_authenticated:
            update_user_activity(request.user, True)

        return Response(
            {"message": "Token valid.", "success": True},
            status=status.HTTP_200_OK
        )

    except (TokenError, InvalidToken):
        return Response(
            {"message": "Token invalid or expired.", "success": False},
            status=status.HTTP_200_OK
        )

