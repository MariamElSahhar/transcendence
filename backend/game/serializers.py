from rest_framework import serializers
from users.models import CustomUser

from .models import RemoteGameLog, LocalGameLog


class LocalGameSerializer(serializers.ModelSerializer):
    score = serializers.ReadOnlyField()

    user = serializers.CharField(source="user.username", read_only=True)
    winnerID = serializers.CharField(
        source="winnerID.username", allow_null=True, read_only=True
    )
    loserID = serializers.CharField(
        source="loserID.username", allow_null=True, read_only=True
    )

    class Meta:
        model = LocalGameLog
        fields = [
            "id",
            "user",
            "game_type",
            "date",
            "localOpponent",
            "my_score",
            "opponent_score",
            "score",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def validate(self, attrs):
        initial_data = getattr(self, "initial_data", {})

        game_type = initial_data.get("game_type")

        if game_type != "pong" and game_type != "tic-tac-toe":
            raise serializers.ValidationError(
                "game_type must be 'pong' or 'tic-tac-toe'"
            )
        return attrs


class RemoteGameSerializer(serializers.ModelSerializer):
    my_score = serializers.SerializerMethodField()
    opponent_score = serializers.SerializerMethodField()
    is_win = serializers.SerializerMethodField()

    users = serializers.CharField(source="users.username", read_only=True)
    winnerID = serializers.CharField(
        source="winnerID.username", allow_null=True, read_only=True
    )
    loserID = serializers.CharField(
        source="loserID.username", allow_null=True, read_only=True
    )

    class Meta:
        model = RemoteGameLog
        fields = [
            "id",
            "users",
            "game_type",
            "date",
            "winnerID",
            "loserID",
            "my_score",
            "opponent_score",
            "score",
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



class TrimmedGameSerializer(serializers.ModelSerializer):
    opponent = serializers.SerializerMethodField()
    my_score = serializers.SerializerMethodField()
    opponent_score = serializers.SerializerMethodField()
    is_win = serializers.SerializerMethodField()

    class Meta:
        model = RemoteGameLog
        fields = ["date", "opponent", "my_score", "opponent_score", "is_win"]

    def _get_user(self):
        """Helper to get the user making the request."""
        request = self.context.get("request")
        if not request:
            return None
        username = request.query_params.get("username", None)
        if username:
            return CustomUser.objects.filter(username=username).first()
        return request.user if request.user.is_authenticated else None

    def get_opponent(self, obj):
        """Determine the opponent dynamically."""
        user = self._get_user()
        if user and user in obj.users.all():
            opponents = obj.users.exclude(id=user.id)
            if opponents.exists():
                return opponents.first().username
        return None

    def get_my_score(self, obj):
        """Return the score of the current user."""
        user = self._get_user()
        if not user:
            return None
        return obj.get_my_score(user.username)

    def get_opponent_score(self, obj):
        """Return the opponent's score."""
        user = self._get_user()
        if not user:
            return None
        return obj.get_opponent_score(user.username)

    def get_is_win(self, obj):
        """Return whether the user won."""
        user = self._get_user()
        if not user:
            return None
        return obj.is_win_for_user(user.username)
