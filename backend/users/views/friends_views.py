from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from ..serializers import FriendSerializer
from ..models import CustomUser

@api_view(['GET', 'POST'])
def get_add_friends_view(request):
    user = request.user
    if request.method == "GET":
        friends = user.get_friends()
        serializer = FriendSerializer(friends, many=True)
        return Response({"message": "Friends retrieved","data":serializer.data}, status=status.HTTP_200_OK)
    if request.method == "POST":
        friend_id = request.data.get("friend_id")

        if not friend_id:
            return Response({"error": "friend_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        friend = get_object_or_404(CustomUser, id=friend_id)

        if friend == user:
            return Response({"error": "You cannot add yourself as a friend."}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.add(friend)
        user.save()
        friend.save()

        return Response({"message": "Friend added successfully."}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def remove_friend_view(request, friend_id):
    user = request.user
    friend = get_object_or_404(CustomUser, id=friend_id)

    if friend not in user.friends.all():
        return Response({"error": "This user is not your friend."}, status=status.HTTP_400_BAD_REQUEST)

    user.friends.remove(friend)
    user.save()
    friend.save()

    return Response({"message": "Friend removed successfully."}, status=status.HTTP_204_NO_CONTENT)
