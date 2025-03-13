from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .models import CustomUser, Phone, Role
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer, PhoneSerializer
from django.contrib.auth.models import User

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return JsonResponse({"error": "Refresh token required"}, status=400)

        # Invalida el token agregándolo a la lista negra
        token = RefreshToken(refresh_token)
        token.blacklist()

        # Elimina las cookies del navegador
        response = JsonResponse({"message": "Logout exitoso"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    custom_user, created = CustomUser.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(custom_user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    custom_user, created = CustomUser.objects.get_or_create(user=request.user)
    data = request.data
    errors = {}

    if "email" in data:
        existing_user = User.objects.filter(email=data["email"]).exclude(id=request.user.id).first()
        if existing_user:
            errors["email"] = "Este email ya está en uso por otro usuario."

    if "dni" in data:
        existing_dni = CustomUser.objects.filter(dni=data["dni"]).exclude(id=custom_user.id).first()
        if existing_dni:
            errors["dni"] = "Este DNI ya está en uso por otro usuario."

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    if "email" in data:
        custom_user.email = data["email"]
        custom_user.user.email = data["email"]

    if "dni" in data:
        custom_user.dni = data["dni"]

    if "birth_date" in data:
        custom_user.birth_date = data["birth_date"]
    if "first_name" in data:
        custom_user.user.first_name = data["first_name"]
    if "last_name" in data:
        custom_user.user.last_name = data["last_name"]


    if "role" in data:
        if data["role"] == "admin":
            custom_user.user.is_staff = True
            custom_user.user.is_superuser = True
        elif data["role"] == "user":
            custom_user.user.is_staff = False
            custom_user.user.is_superuser = False

    custom_user.user.save()
    custom_user.save()

    serializer = UserProfileSerializer(custom_user)
    return Response(serializer.data)
