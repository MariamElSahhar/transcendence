from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from ..serializers import FriendSerializer
from ..models import CustomUser

# GET ALL FRIENDS OR ADD A FRIEND BY ID
@api_view(['GET', 'POST'])
def get_add_friends_view(request, user_id):
    if user_id != request.user.id:
        return Response({"error": "None of your business. You may only view your own friends."}, status=status.HTTP_401_UNAUTHORIZED)
    user = request.user

    # Get friends
    if request.method == "GET":
        friends = user.get_friends()
        serializer = FriendSerializer(friends, many=True, context={'user_id': user_id})
        return Response({"message": "Friends retrieved","data":serializer.data}, status=status.HTTP_200_OK)

    # Add friend
    if request.method == "POST":
        friend_id = request.data.get("friend_id")

        if friend_id is None:
            return Response({"error": "Friend ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # customizing the error message
        friend = CustomUser.objects.filter(id=friend_id).first()
        if not friend:
            return Response({"error": "Friend not found."}, status=status.HTTP_404_NOT_FOUND)

        if friend == user:
            return Response({"error": "You cannot add yourself as a friend."}, status=status.HTTP_400_BAD_REQUEST)

        if user.friends.filter(id=friend_id).exists():
            return Response({"error": "This person is already your friend."}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.add(friend)
        user.save()
        friend.save()

        return Response({"message": "Friend added successfully."}, status=status.HTTP_201_CREATED)

# DELETE FRIEND BY ID
@api_view(['DELETE'])
def remove_friend_view(request, user_id, friend_id):
    if user_id != request.user.id:
        return Response({"error": "You can only remove your own friends."}, status=status.HTTP_401_UNAUTHORIZED)
    user = request.user

    friend = CustomUser.objects.filter(id=friend_id).first()
    if not friend or friend not in user.friends.all():
        return Response({"error": "Friend not found."}, status=status.HTTP_404_NOT_FOUND)

    user.friends.remove(friend)
    user.save()
    friend.save()

    return Response({"message": "Friend removed successfully."}, status=status.HTTP_204_NO_CONTENT)
