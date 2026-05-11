from rest_framework import serializers
from .models import User, Token, Request, Connection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone_number', 'profile_picture', 'nid_card_picture', 'address', 'bio', 'email_verified', 'created_at']
        read_only_fields = ['email_verified', 'created_at']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'phone_number', 'password', 'profile_picture', 'nid_card_picture', 'address', 'bio']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data['phone_number'],
            profile_picture=validated_data.get('profile_picture'),
            nid_card_picture=validated_data.get('nid_card_picture'),
            address=validated_data.get('address'),
            bio=validated_data.get('bio', ''),
        )
        return user

class TokenSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Token
        fields = ['id', 'user', 'title', 'vehicle_type', 'additional_info', 'latitude', 'longitude', 'status', 'created_at', 'updated_at']
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']

class TokenCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['title', 'vehicle_type', 'additional_info', 'latitude', 'longitude']

class RequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_token = TokenSerializer(read_only=True)

    class Meta:
        model = Request
        fields = ['id', 'from_user', 'to_token', 'created_at', 'status']

class ConnectionSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    token_info = TokenSerializer(source='token', read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'other_user', 'token_info', 'created_at']

    def get_other_user(self, obj):
        try:
            user = self.context.get('request').user if self.context.get('request') else None
            if not user:
                return None
            other = obj.user2 if obj.user1 == user else obj.user1
            return UserSerializer(other).data
        except (AttributeError, KeyError):
            return None