import random
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from rest_framework.exceptions import ValidationError

from ..models import Game
from django.db import models

# Tells you if you are subscribed to matchmaking or playing a game
# If you are in a game, returns the game information
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def play_view(request):
    user = request.user

    # Filter for games where the user is one of the players and there is no overall game winner
    game = Game.objects.filter(
        status__in=['MATCHMAKING', 'PLAYING']
    ).filter(
        models.Q(player_1=user) | models.Q(player_2=user)
    ).first()

    if game:
        if game.status == "MATCHMAKING":
            matchmaking_info = {
                "id": game.id,
                "status": game.status,
                "player_1": game.player_1.username if game.player_1 else None,
                "player_2": game.player_2.username if game.player_2 else None,
                "message": "You are currently in matchmaking. Waiting for another player.",
            }
            return Response({"game": matchmaking_info}, status=status.HTTP_200_OK)

        # Construct game info, handling possible None values for all players and winners
        game_info = {
            "id": game.id,
            "status": game.status,
            "player_1": game.player_1.username if game.player_1 else None,
            "player_2": game.player_2.username if game.player_2 else None,
            "map_round_1": game.map_round_1,
            "map_round_2": game.map_round_2,
            "map_round_3": game.map_round_3,
            "current_round": game.current_round,
            "next_to_play": game.next_to_play.username if game.next_to_play else None,
            "last_play_time": game.last_play_time,
            "winner_round_1": game.winner_round_1.username if game.winner_round_1 else None,
            "winner_round_2": game.winner_round_2.username if game.winner_round_2 else None,
            "winner_round_3": game.winner_round_3.username if game.winner_round_3 else None,
        }
        return Response({"game": game_info}, status=status.HTTP_200_OK)

    return Response({"message": "No active game found"}, status=status.HTTP_200_OK)

# Subscribes you to matchmaking
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_matchmaking_view(request):
    user = request.user

    # Check if the user is already in an active game (MATCHMAKING or PLAYING)
    active_game = Game.objects.filter(
        models.Q(player_1=user) | models.Q(player_2=user),
        status__in=['MATCHMAKING', 'PLAYING']
    ).first()

    if active_game:
        return Response({
            "error": "You are already in an active game.",
            "game_id": active_game.id,
            "status": active_game.status
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check if there is an existing game in matchmaking with only one player
    game = Game.objects.filter(
        status='MATCHMAKING',
        player_2__isnull=True
    ).first()

    if game:
        # If a game is found, assign the current user as player_2 and update the status to PLAYING
        game.player_2 = user
        game.status = 'PLAYING'
        game.next_to_play = random.choice([game.player_1, game.player_2])
        game.last_play_time = now()
        game.save()
        return Response({
            "message": "Match found! Game started.",
            "game_id": game.id
        }, status=status.HTTP_200_OK)

    # If no matchmaking game exists, create a new one with the current user as player_1
    new_game = Game.objects.create(
        status='MATCHMAKING',
        player_1=user
    )
    return Response({
        "message": "You have been subscribed to matchmaking.",
        "game_id": new_game.id
    }, status=status.HTTP_201_CREATED)


# Unsubscribes you to matchmaking or leave a game
# Unsubscribes the user from matchmaking
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_matchmaking_view(request):
    user = request.user

    # Check if the user has an active game in matchmaking
    matchmaking_game = Game.objects.filter(
        player_1=user,
        status='MATCHMAKING',
        player_2__isnull=True
    ).first()

    if not matchmaking_game:
        return Response({
            "error": "You are not currently in matchmaking."
        }, status=status.HTTP_400_BAD_REQUEST)

    # Delete or update the matchmaking game
    matchmaking_game.delete()  # Delete the game entry
    return Response({
        "message": "You have been unsubscribed from matchmaking."
    }, status=status.HTTP_200_OK)

# @api_view(["DELETE"])
# def play_view(request):
#     return Response({"message": "TEST!!"}, status=status.HTTP_200_OK)

# Make a move in the game
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def make_move_view(request):
    user = request.user
    game_id = request.data.get("game_id")
    move = request.data.get("move")  # The move should be the position (0-8) in the 3x3 grid

    # Validate inputs
    if game_id is None or move is None:
        raise ValidationError("Game ID and move are required.")

    # Retrieve the game
    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return Response({"error": "Game not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the game is active and the user is part of it
    if game.status != "PLAYING" or user not in [game.player_1, game.player_2]:
        return Response({"error": "You cannot make a move in this game."}, status=status.HTTP_403_FORBIDDEN)

    # Check if it is the user's turn
    if game.next_to_play != user:
        return Response({"error": "It is not your turn."}, status=status.HTTP_403_FORBIDDEN)

    # Get the current round map
    if game.current_round == 1:
        current_map = game.map_round_1
    elif game.current_round == 2:
        current_map = game.map_round_2
    elif game.current_round == 3:
        current_map = game.map_round_3
    else:
        return Response({"error": "Invalid game round."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate the move
    try:
        position = int(move)
        if position < 0 or position >= 9:
            raise ValueError
    except ValueError:
        return Response({"error": "Invalid move. Position must be between 0 and 8."}, status=status.HTTP_400_BAD_REQUEST)

    if current_map[position] != "-":
        return Response({"error": "Invalid move. Position already occupied."}, status=status.HTTP_400_BAD_REQUEST)

    # Update the map with the player's symbol
    player_symbol = "X" if game.player_1 == user else "O"
    updated_map = current_map[:position] + player_symbol + current_map[position + 1:]

    # Save the updated map
    if game.current_round == 1:
        game.map_round_1 = updated_map
    elif game.current_round == 2:
        game.map_round_2 = updated_map
    elif game.current_round == 3:
        game.map_round_3 = updated_map

    # Check for a winner in the current round
    winning_combinations = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # Rows
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # Columns
        (0, 4, 8), (2, 4, 6)              # Diagonals
    ]
    round_is_over = False

    if any(all(updated_map[i] == player_symbol for i in combo) for combo in winning_combinations):
        if game.current_round == 1:
            game.winner_round_1 = user
            round_is_over = True
        elif game.current_round == 2:
            game.winner_round_2 = user
            round_is_over = True
        elif game.current_round == 3:
            game.winner_round_3 = user
            round_is_over = True

    if round_is_over:
        # Check if the game is over (all rounds played and a winner is decided)
        if game.current_round == 3:
            round_winners = [game.winner_round_1, game.winner_round_2, game.winner_round_3]
            player_1_wins = round_winners.count(game.player_1)
            player_2_wins = round_winners.count(game.player_2)
            if player_1_wins >= 2:  # Player 1 wins best of 3
                game.game_winner = game.player_1
                game.status = "FINISHED"
            elif player_2_wins >= 2:  # Player 2 wins best of 3
                game.game_winner = game.player_2
                game.status = "FINISHED"
            else:
                if player_1_wins == player_2_wins:
                    game.status = "FINISHED"
                    game.game_winner = None  # No overall winner
        else:
            game.current_round += 1

    # Update last play time and next player
    game.last_play_time = now()
    game.next_to_play = game.player_2 if user == game.player_1 else game.player_1

    game.save()

    return Response({
        "message": "Move made successfully.",
        "game_id": game.id,
        "updated_map": updated_map,
        "current_round": game.current_round,
        "next_to_play": game.next_to_play.id if game.next_to_play else None,
        "game_status": game.status,
        "game_winner": game.game_winner.username if game.game_winner else None,
    }, status=status.HTTP_200_OK)

# when the game is done and setting the game is finished
# when player finished the entire roound of the game
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def finished_game_view(request):
    user = request.user

    # Query for finished games where the user is either player_1 or player_2
    finished_games = Game.objects.filter(
        status='FINISHED',
    ).filter(
        player_1=user
    ) | Game.objects.filter(
        status='FINISHED',
        player_2=user
    )

    if not finished_games.exists():
        return Response({"detail": "No finished games found for the user."}, status=404)

    # Serialize or return game details
    games_data = [
        {
            "game_id": game.id,
            "player_1": game.player_1.username,
            "player_2": game.player_2.username,
            "status": game.status,
        }
        for game in finished_games
    ]

    return Response({"finished_games": games_data}, status=200)
