from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from ..utils import set_response_cookie, update_user_activity


# REFRESH TOKEN
@api_view(["POST"])
@permission_classes([AllowAny])
def token_refresh_view(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if refresh_token is None:
        return Response({"error": "Refresh token not provided."}, status=400)

    token_serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
    if token_serializer.is_valid():
        tokens = token_serializer.validated_data
        response = Response(
            {"message": "Refresh successful."}, status=status.HTTP_200_OK
        )
        response = set_response_cookie(response, tokens, None, False)
        return response
    else:
        error_messages = []
        for _, errors in token_serializer.errors.items():
            error_messages.extend(errors)
        return Response({"error": error_messages}, status=status.HTTP_400_BAD_REQUEST)


# TOKEN STATUS
@api_view(["GET"])
def token_status_view(request):
    update_user_activity(request.user, True)
    return Response({"message": "Token valid"}, status=status.HTTP_200_OK)
