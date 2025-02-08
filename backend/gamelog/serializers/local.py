from rest_framework import serializers
from users.models import CustomUser

from ..models import LocalGameLog


class CreateLocalGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalGameLog
        fields = [
            "opponent_username",
            "my_score",
            "opponent_score",
            "tournament_round",
        ]

    def validate(self, data):
        my_score = data.get("my_score")
        opponent_score = data.get("opponent_score")

        if my_score is None or opponent_score is None:
            raise serializers.ValidationError(
                "Both my_score and opponent_score are required."
            )

        return data

    def create(self, validated_data):
        user = validated_data.pop("user", None)
        if not user:
            raise serializers.ValidationError("User is required.")

        local_game = LocalGameLog.objects.create(users=user, **validated_data)

        return local_game


class LocalGameSerializer(serializers.ModelSerializer):
    users = serializers.CharField(source="user.username", read_only=True)
    is_win = serializers.SerializerMethodField()

    class Meta:
        model = LocalGameLog
        fields = [
            "users",
            "date",
            "opponent_username",
            "my_score",
            "opponent_score",
            "is_win",
            "tournament_round"
        ]

    def get_is_win(self, obj):
        """Return whether the user won the game."""
        return obj.is_win_for_user()

    def _get_user(self):
        """Helper to get the user making the request."""
        request = self.context.get("request")
        if not request:
            return None
        username = request.query_params.get("username", None)
        if username:
            return CustomUser.objects.filter(username=username).first()
        return request.user if request.user.is_authenticated else None

    def get_my_score(self, obj):
        """Return the score of the user making the request."""
        user = self._get_user()
        if not user or user != obj.user:
            return None
        return obj.my_score

    def get_opponent_score(self, obj):
        """Return the opponent's score."""
        user = self._get_user()
        if not user or user != obj.user:
            return None
        return obj.opponent_score
