from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
from django_countries.fields import Country
from django_countries import countries
import jwt
from django.conf import settings

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response({"detail": "Refresh token no proporcionado"}, status=400)

            try:
                decoded_token = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])

                user_id = decoded_token.get("user_id")
                if not user_id:
                    return Response({"detail": "No se encontró user_id en el token"}, status=400)

                user = CustomUser.objects.get(id=user_id)
                response.data["user"] = UserProfileSerializer(user).data

            except jwt.ExpiredSignatureError:
                return Response({"detail": "El token ha expirado"}, status=401)
            except jwt.InvalidTokenError:
                return Response({"detail": "Token inválido"}, status=401)
            except CustomUser.DoesNotExist:
                return Response({"detail": "Usuario no encontrado"}, status=404)
            except Exception as e:
                print("❌ Error en CustomTokenRefreshView:", str(e))
                return Response({"detail": "No se pudo recuperar el usuario"}, status=400)

        return response


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

    if "country" in data and data["country"] not in dict(countries):
        errors["country"] = "País inválido. Debe ser un código ISO 3166-1 válido."

    if "nationality" in data and data["nationality"] not in dict(countries):
        errors["nationality"] = "Nacionalidad inválida. Debe ser un código ISO 3166-1 válido."

    if "phones" in data:
        phone_numbers = set()
        for phone_data in data["phones"]:
            phone_id = phone_data.get("id")
            country_code = phone_data.get("country_code", "").strip()
            area_code = phone_data.get("area_code", "").strip()
            phone_number = phone_data.get("phone_number", "").strip()

            if not country_code or not area_code or not phone_number:
                errors["phones"] = "Todos los campos del teléfono (country_code, area_code, phone_number) son obligatorios."

            existing_phone = Phone.objects.filter(
                country_code=country_code,
                area_code=area_code,
                phone_number=phone_number
            ).exclude(user=custom_user).first()

            if existing_phone:
                errors["phones"] = f"El número {country_code} {area_code} {phone_number} ya está en uso por otro usuario."

            phone_key = (country_code, area_code, phone_number)
            if phone_key in phone_numbers:
                errors["phones"] = f"El número {country_code} {area_code} {phone_number} está duplicado en la solicitud."
            phone_numbers.add(phone_key)

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

    if "country" in data:
        custom_user.country = data["country"]

    if "nationality" in data:
        custom_user.nationality = data["nationality"]

    if "province" in data:
        custom_user.province = data["province"]

    if "read_qr" in data:
        custom_user.read_qr = bool(data["read_qr"])

    if "role" in data:
        if data["role"] == "admin":
            custom_user.user.is_staff = True
            custom_user.user.is_superuser = True
            custom_user.role = Role.objects.get(name="admin")
        elif data["role"] == "user":
            custom_user.user.is_staff = False
            custom_user.user.is_superuser = False
            custom_user.role = Role.objects.get(name="user")

    if "phones" in data:
        existing_phone_ids = set(custom_user.phones.values_list("id", flat=True))
        updated_phone_ids = set()

        for phone_data in data["phones"]:
            phone_id = phone_data.get("id")
            country_code = phone_data["country_code"].strip()
            area_code = phone_data["area_code"].strip()
            phone_number = phone_data["phone_number"].strip()
            phone_type = phone_data["type"]

            if phone_id:
                try:
                    phone = Phone.objects.get(id=phone_id, user=custom_user)
                    phone.country_code = country_code
                    phone.area_code = area_code
                    phone.phone_number = phone_number
                    phone.type = phone_type
                    phone.save()
                    updated_phone_ids.add(phone.id)
                except Phone.DoesNotExist:
                    errors["phones"] = f"El teléfono con ID {phone_id} no existe."
            else:
                phone, created = Phone.objects.get_or_create(
                    user=custom_user,
                    country_code=country_code,
                    area_code=area_code,
                    phone_number=phone_number,
                    defaults={"type": phone_type}
                )
                if not created:
                    phone.type = phone_type
                    phone.save()
                updated_phone_ids.add(phone.id)

        phones_to_remove = existing_phone_ids - updated_phone_ids
        Phone.objects.filter(id__in=phones_to_remove).delete()

    custom_user.user.save()
    custom_user.save()

    serializer = UserProfileSerializer(custom_user)
    return Response(serializer.data)
