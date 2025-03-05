from rest_framework import serializers
from users.models import CustomUser

from ..models import TicTacToeLog


class CreateTTTGameSerializer(serializers.ModelSerializer):
    player1_id = serializers.IntegerField(write_only=True)
    player2_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = TicTacToeLog
        fields = [
            "player1_id",
            "player2_id",
            "player1_score",
            "player2_score",
        ]

    def validate(self, data):
        player1_id = data.get("player1_id")
        player2_id = data.get("player2_id")

        if not player1_id or not player2_id:
            raise serializers.ValidationError("Both player1 and player2 are required.")

        if player1_id == player2_id:
            raise serializers.ValidationError("Winner and loser cannot be the same user.")

        try:
            player1 = CustomUser.objects.get(id=player1_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"player1_id": f"User with ID {player1_id} does not exist."})

        try:
            player2 = CustomUser.objects.get(id=player2_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"player2_id": f"User with ID {player2_id} does not exist."})

        data["player1"] = player1
        data["player2"] = player2
        return data

    def create(self, validated_data):
        ttt_game = TicTacToeLog.objects.create(**validated_data)
        ttt_game.users.set([validated_data["player1"], validated_data["player2"]])

        return ttt_game


class TicTacToeSerializer(serializers.ModelSerializer):
    opponent_username = serializers.SerializerMethodField()
    my_score = serializers.SerializerMethodField()
    opponent_score = serializers.SerializerMethodField()
    is_win = serializers.SerializerMethodField()
    is_draw = serializers.SerializerMethodField()

    users = serializers.CharField(source="users.username", read_only=True)

    class Meta:
        model = TicTacToeLog
        fields = [
            "users",
            "date",
            "opponent_username",
            "my_score",
            "opponent_score",
            "is_win",
            "is_draw",
        ]

    def _get_user(self):
        """Helper to get the target user."""
        return CustomUser.objects.filter(id=self.context.get("user_id")).first()

    def get_my_score(self, obj):
        """Return the score of the target user."""
        return obj.get_my_score(self._get_user().id)

    def get_opponent_username(self, obj):
        """Determine the opponent dynamically."""
        user = self._get_user()
        if user and user in obj.users.all():
            opponents = obj.users.exclude(id=user.id)
            return opponents.first().username if opponents.exists() else "Deleted User"
        return None

    def get_opponent_score(self, obj):
        """Return the opponent's score."""
        return obj.get_opponent_score(self._get_user().id)

    def get_is_win(self, obj):
        """Return whether the user won the game."""
        user = self._get_user()
        return obj.get_my_score(user.id) > obj.get_opponent_score(user.id)

    def get_is_draw(self, obj):
        """Return whether the user won the game."""
        user = self._get_user()
        return obj.get_my_score(user.id) == obj.get_opponent_score(user.id)
