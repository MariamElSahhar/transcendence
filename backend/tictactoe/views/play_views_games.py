# game/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# A global variable to simulate game storage (for simplicity)
games = {}

# Function to check for a win or draw
def check_win(map):
    # Check rows
    for i in range(3):
        if map[i][0] == map[i][1] == map[i][2] and map[i][0] != "":
            return map[i][0]
    # Check columns
    for i in range(3):
        if map[0][i] == map[1][i] == map[2][i] and map[0][i] != "":
            return map[0][i]
    # Check diagonals
    if map[0][0] == map[1][1] == map[2][2] and map[0][0] != "":
        return map[0][0]
    if map[0][2] == map[1][1] == map[2][0] and map[0][2] != "":
        return map[0][2]
    # Check for draw
    if all(cell != "" for row in map for cell in row):
        return "draw"
    return None

# Create a new game
@csrf_exempt
def create_game(request):
    game_id = len(games) + 1
    games[game_id] = [["", "", ""], ["", "", ""], ["", "", ""]]
    return JsonResponse({"game_id": game_id, "message": "Game created"})

# Make a move
@csrf_exempt
def make_move(request, game_id):
    if request.method == "POST":
        data = json.loads(request.body)
        x, y, player = data["x"], data["y"], data["player"]
        
        if game_id not in games:
            return JsonResponse({"error": "Invalid game ID"}, status=404)
        
        game = games[game_id]
        
        if game[y][x] != "":
            return JsonResponse({"error": "Cell already filled"}, status=400)
        
        game[y][x] = player
        winner = check_win(game)
        
        if winner == "draw":
            return JsonResponse({"message": "Game is a draw"})
        elif winner:
            return JsonResponse({"message": f"Player {winner} wins"})
        
        return JsonResponse({"message": "Move successful", "game_state": game})

# Get game status
def game_status(request, game_id):
    if game_id not in games:
        return JsonResponse({"error": "Invalid game ID"}, status=404)
    return JsonResponse({"game_state": games[game_id]})


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework import status
# from django.db import models
# from rest_framework.permissions import IsAuthenticated
# import json

# # Utility function to check for a win or draw
# def check_win(map):
#     for i in range(3):
#         if map[i][0] == map[i][1] == map[i][2] and map[i][0] != "":
#             return map[i][0]
#     for i in range(3):
#         if map[0][i] == map[1][i] == map[2][i] and map[0][i] != "":
#             return map[0][i]
#     if map[0][0] == map[1][1] == map[2][2] and map[0][0] != "":
#         return map[0][0]
#     if map[0][2] == map[1][1] == map[2][0] and map[0][2] != "":
#         return map[0][2]
#     if all(cell != "" for row in map for cell in row):
#         return "draw"
#     return None

# # Fetch an active game or create a new one
# @api_view(["GET", "POST"])
# @permission_classes([IsAuthenticated])
# def play_view(request):
#     user = request.user

#     if request.method == "GET":
#         # Fetch an existing game
#         game = Game.objects.filter(
#             winner__isnull=True
#         ).filter(
#             models.Q(player_1=user) | models.Q(player_2=user)
#         ).first()

#         if game:
#             game_info = {
#                 "id": game.id,
#                 "player_1": game.player_1.id if game.player_1 else None,
#                 "player_2": game.player_2.id if game.player_2 else None,
#                 "map": game.map,
#                 "next_to_play": game.next_to_play.id if game.next_to_play else None,
#                 "last_play_time": game.last_play_time,
#             }
#             return Response({"game": game_info}, status=status.HTTP_200_OK)
#         return Response({"message": "No active game found"}, status=status.HTTP_200_OK)

#     elif request.method == "POST":
#         # Create a new game
#         new_game = Game.objects.create(
#             player_1=user,
#             map=[["", "", ""], ["", "", ""], ["", "", ""]],
#             next_to_play=user,
#         )
#         return Response(
#             {
#                 "message": "Game created",
#                 "game_id": new_game.id,
#                 "map": new_game.map,
#             },
#             status=status.HTTP_201_CREATED,
#         )

# # Make a move in the game
# @csrf_exempt
# def make_move(request, game_id):
#     if request.method == "POST":
#         try:
#             game = Game.objects.get(id=game_id)
#         except Game.DoesNotExist:
#             return JsonResponse({"error": "Invalid game ID"}, status=404)

#         data = json.loads(request.body)
#         x, y, player = data["x"], data["y"], data["player"]

#         # Ensure the current player matches the `next_to_play`
#         if game.next_to_play.username != player:
#             return JsonResponse({"error": "Not your turn"}, status=403)

#         # Check if the cell is already filled
#         map = game.map
#         if map[y][x] != "":
#             return JsonResponse({"error": "Cell already filled"}, status=400)

#         # Make the move
#         map[y][x] = player
#         game.map = map

#         # Check for a win or draw
#         winner = check_win(map)
#         if winner:
#             game.winner = game.player_1 if game.player_1.username == winner else game.player_2
#             game.save()
#             return JsonResponse({"message": f"Player {winner} wins!"})
#         elif winner == "draw":
#             return JsonResponse({"message": "Game is a draw"})

#         # Update `next_to_play`
#         game.next_to_play = game.player_1 if game.next_to_play == game.player_2 else game.player_2
#         game.save()

#         return JsonResponse({"message": "Move successful", "game_state": map})

# # Get game status
# @api_view(["GET"])
# def game_status(request, game_id):
#     try:
#         game = Game.objects.get(id=game_id)
#     except Game.DoesNotExist:
#         return JsonResponse({"error": "Invalid game ID"}, status=404)

#     return JsonResponse(
#         {
#             "game_id": game.id,
#             "map": game.map,
#             "player_1": game.player_1.username if game.player_1 else None,
#             "player_2": game.player_2.username if game.player_2 else None,
#             "next_to_play": game.next_to_play.username if game.next_to_play else None,
#         }
#     )
