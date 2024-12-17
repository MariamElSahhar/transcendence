from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response


# TOKEN STATUS
@api_view(["GET"])
@permission_classes([AllowAny])
def test_view(request):
    return Response({"message": "Hello from remote-pong api!"}, status=status.HTTP_200_OK)

