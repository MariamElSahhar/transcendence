from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import GameModel
from ..serializers import GameSerializer


# GET OR CREATE NEW GAMESLOGS
@api_view(["GET", "POST"])
def gamelog_view(request):
    user = request.user
    if request.method == "GET":
        if user.is_authenticated:
            games = GameModel.objects.filter(user=user)
            serializer = GameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            games = GameModel.objects.all()
            serializer = GameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        if user.is_authenticated:
            data = request.data.copy()
            data["user"] = user.id
            serializer = GameSerializer(data=data, context={"request": request})
            if serializer.is_valid(raise_exception=True):
                serializer.save(user=user)
                return Response(
                    {"message": "Game history created", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
