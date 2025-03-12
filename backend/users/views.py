from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .models import CustomUser, Phone, Role
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

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
