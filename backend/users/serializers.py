from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        custom_user = getattr(user, 'customuser', None)

        token['email'] = custom_user.email if custom_user else None
        token['dni'] = custom_user.dni if custom_user else None
        token['role'] = custom_user.role.name if custom_user and custom_user.role else None

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        custom_user = getattr(user, 'customuser', None)

        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': custom_user.email if custom_user else None,
            'dni': custom_user.dni if custom_user else None,
            'role': custom_user.role.name if custom_user and custom_user.role else None,
            'first_name': user.first_name,
            'last_name': user.last_name
        }

        return data
