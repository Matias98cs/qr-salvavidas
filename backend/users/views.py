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

    if "phones" in data:
        current_phone_ids = set(custom_user.phones.values_list("id", flat=True))
        updated_phone_ids = set()

        new_phones = []
        for phone_data in data["phones"]:
            phone_id = phone_data.get("id")

            if phone_id:
                try:
                    phone = Phone.objects.get(id=phone_id)
                    phone.number = phone_data["number"]
                    phone.type = phone_data["type"]
                    phone.save()
                    updated_phone_ids.add(phone.id)
                except Phone.DoesNotExist:
                    return Response({"error": f"El teléfono con ID {phone_id} no existe"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                phone, created = Phone.objects.get_or_create(
                    number=phone_data["number"],
                    defaults={"type": phone_data["type"]}
                )
                if not created:
                    phone.type = phone_data["type"]
                    phone.save()
                
                updated_phone_ids.add(phone.id)

            new_phones.append(phone)

        phones_to_remove = current_phone_ids - updated_phone_ids
        custom_user.phones.remove(*phones_to_remove)

        custom_user.phones.set(new_phones)

    if "role" in data:
        try:
            custom_user.role = Role.objects.get(name=data["role"])
        except Role.DoesNotExist:
            return Response({"error": "El rol especificado no existe"}, status=status.HTTP_400_BAD_REQUEST)

    custom_user.user.save()
    custom_user.save()

    serializer = UserProfileSerializer(custom_user)
    return Response(serializer.data)