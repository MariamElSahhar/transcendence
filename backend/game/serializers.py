from rest_framework import serializers
from users.models import CustomUser

from .models import GameModel


class GameSerializer(serializers.ModelSerializer):
    score = serializers.ReadOnlyField()

    user = serializers.CharField(source="user.username", read_only=True)
    winnerID = serializers.CharField(
        source="winnerID.username", allow_null=True, read_only=True
    )
    loserID = serializers.CharField(
        source="loserID.username", allow_null=True, read_only=True
    )

    class Meta:
        model = GameModel
        fields = [
            "id",
            "user",
            "game_type",
            "date",
            "tournamentID",
            "winnerID",
            "loserID",
            "localgame",
            "score_numerator",
            "score_denominator",
            "score",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def validate(self, attrs):
        score_numerator = attrs.get("score_numerator")
        score_denominator = attrs.get("score_denominator")

        initial_data = getattr(self, "initial_data", {})

        winner_username = initial_data.get("winnerID")
        loser_username = initial_data.get("loserID")
        user = self.context["request"].user

        winner = (
            CustomUser.objects.filter(username=winner_username).first()
            if winner_username
            else None
        )
        loser = (
            CustomUser.objects.filter(username=loser_username).first()
            if loser_username
            else None
        )

        if score_numerator > score_denominator:
            if winner != user:
                raise serializers.ValidationError(
                    {
                        "non_field_errors": "winnerID must be the user if score_numerator > score_denominator"
                    }
                )
        elif score_numerator < score_denominator:
            if loser != user:
                raise serializers.ValidationError(
                    {
                        "non_field_errors": "loserID must be the user if score_numerator < score_denominator"
                    }
                )

        attrs["winnerID"] = winner
        attrs["loserID"] = loser

        return attrs
