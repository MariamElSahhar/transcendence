from rest_framework import serializers
from users.models import CustomUser

from .models import RemoteGameLog, LocalGameLog


class CreateLocalGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalGameLog
        fields = [
            "opponent_username",
            "my_score",
            "opponent_score",
            "tournamentID",
        ]

    def validate(self, data):
        my_score = data.get("my_score")
        opponent_score = data.get("opponent_score")

        if not my_score or not opponent_score:
            raise serializers.ValidationError(
                "Both my_score and opponent_score are required."
            )

        return data

    def create(self, validated_data):
        print(validated_data)
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


class CreateRemoteGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = RemoteGameLog
        fields = [
            "winnerID",
            "loserID",
            "winner_score",
            "loser_score",
        ]

    def validate(self, data):
        winner = data.get("winnerID")
        loser = data.get("loserID")

        if not winner or not loser:
            raise serializers.ValidationError("Both winnerID and loserID are required.")

        if winner == loser:
            raise serializers.ValidationError(
                "Winner and loser cannot be the same user."
            )

        if not CustomUser.objects.filter(id=winner.id).exists():
            raise serializers.ValidationError(
                f"Winner with ID {winner} does not exist."
            )

        if not CustomUser.objects.filter(id=loser.id).exists():
            raise serializers.ValidationError(f"Loser with ID {loser} does not exist.")

        return data

    def create(self, validated_data):
        remote_game = RemoteGameLog.objects.create(**validated_data)
        remote_game.users.set([validated_data["winnerID"], validated_data["loserID"]])

        return remote_game


class RemoteGameSerializer(serializers.ModelSerializer):
    opponent = serializers.SerializerMethodField()
    my_score = serializers.SerializerMethodField()
    opponent_score = serializers.SerializerMethodField()
    is_win = serializers.SerializerMethodField()

    users = serializers.CharField(source="users.username", read_only=True)

    class Meta:
        model = RemoteGameLog
        fields = [
            "users",
            "date",
            "opponent",
            "my_score",
            "opponent_score",
            "is_win",
        ]

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
        if not user or user not in obj.users.all():
            return None
        return obj.get_my_score(user.username)

    def get_opponent(self, obj):
        """Determine the opponent dynamically."""
        user = self._get_user()

        if user and user in obj.users.all():
            opponents = obj.users.exclude(id=user.id)
            return opponents.first().username if opponents.exists() else "Deleted User"
        return None

    def get_opponent_score(self, obj):
        """Return the opponent's score."""
        user = self._get_user()
        if not user or user not in obj.users.all():
            return None
        return obj.get_opponent_score(user.username)

    def get_is_win(self, obj):
        """Return whether the user won the game."""
        user = self._get_user()
        if not user or user not in obj.users.all():
            return None
        return obj.is_win_for_user(user.username)
