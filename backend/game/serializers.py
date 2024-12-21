from rest_framework import serializers
from users.models import CustomUser

from .models import RemoteGameLog, LocalGameLog


class LocalGameSerializer(serializers.ModelSerializer):
    users = serializers.CharField(source="user.username", read_only=True)
    # localOpponent = serializers.CharField(read_only=True)

    # winnerID = serializers.CharField(
    #     source="winnerID.username", allow_null=True, read_only=True
    # )
    # loserID = serializers.CharField(
    #     source="loserID.username", allow_null=True, read_only=True
    # )
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


class RemoteGameSerializer(serializers.ModelSerializer):
    opponent = serializers.SerializerMethodField()
    my_score = serializers.SerializerMethodField()
    opponent_score = serializers.SerializerMethodField()
    is_win = serializers.SerializerMethodField()

    users = serializers.CharField(source="users.username", read_only=True)
    # winnerID = serializers.CharField(
    #     source="winnerID.username", allow_null=True, read_only=True
    # )
    # loserID = serializers.CharField(
    #     source="loserID.username", allow_null=True, read_only=True
    # )

    class Meta:
        model = RemoteGameLog
        fields = [
            # "id",
            # "game_type",
            "users",
            "date",
            "opponent",
            # "winnerID",
            # "loserID",
            "my_score",
            "opponent_score",
            # "score",
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
            return opponents.first().username if opponents.exists() else None
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


class TrimmedGameSerializer(serializers.Serializer):
    opponent = serializers.SerializerMethodField()
    my_score = serializers.SerializerMethodField()
    opponent_score = serializers.SerializerMethodField()
    is_win = serializers.SerializerMethodField()

    class Meta:
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

        if obj.game_type == "Remote":
            if user and user in obj.users.all():
                opponents = obj.users.exclude(id=user.id)
                return opponents.first().username if opponents.exists() else None
        elif obj.game_type == "Local":
            return obj.opponent_username

        return None

    def get_my_score(self, obj):
        """Return the score of the current user."""
        user = self._get_user()

        if obj.game_type == "Remote":
            if user:
                return obj.get_my_score(user.username)
        elif obj.game_type == "Local":
            return obj.my_score if user and user == obj.users else None

        return None

    def get_opponent_score(self, obj):
        """Return the opponent's score."""
        user = self._get_user()

        if obj.game_type == "Remote":
            if user:
                return obj.get_opponent_score(user.username)
        elif obj.game_type == "Local":
            return obj.opponent_score

        return None

    def get_is_win(self, obj):
        """Return whether the user won."""
        user = self._get_user()

        if obj.game_type == "Remote":
            if user:
                return obj.is_win_for_user(user.username)
        elif obj.game_type == "Local":
            return obj.is_win_for_user() if user and user == obj.users else None

        return None
