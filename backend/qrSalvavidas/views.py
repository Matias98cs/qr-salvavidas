from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import Person, AmbulanceService, MedicalCoverage, QRData
from .serializers import PersonListSerializer, PersonDetailSerializer, AmbulanceServiceSerializer, MedicalCoverageSerializer
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from PIL import Image, ImageEnhance
import qrcode
import io
import base64

class PersonViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pk = self.kwargs["pk"]

        if self.action in ["active_person"]:
            try:
                return Person.objects.get(pk=pk)
            except Person.DoesNotExist:
                raise NotFound("La persona no fue encontrada.")

        try:
            return self.get_queryset().get(pk=pk)
        except Person.DoesNotExist:
            raise NotFound("La persona no fue encontrada.")

    def get_queryset(self):
        show_deleted = self.request.query_params.get("show_deleted", "false").lower() == "true"
        
        if show_deleted:
            return Person.objects.filter(is_deleted=True)
        return Person.objects.filter(is_deleted=False)

    def get_serializer_class(self):
        if self.action == 'list':
            return PersonListSerializer
        return PersonDetailSerializer

    def perform_create(self, serializer):
        self._check_user_data_complete()
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        self._check_user_data_complete()
        serializer.save(updated_by=self.request.user)

    def _check_user_data_complete(self):
        user = self.request.user
        custom_user = getattr(user, 'customuser', None)

        required_user_fields = ['first_name', 'last_name']
        required_custom_fields = ['email', 'dni', 'birth_date', 'country', 'nationality', 'province']

        field_labels = {
            'first_name': 'Nombre',
            'last_name': 'Apellido',
            'email': 'Email',
            'dni': 'DNI',
            'birth_date': 'Fecha de nacimiento',
            'country': 'País',
            'nationality': 'Nacionalidad',
            'province': 'Provincia',
        }

        missing = []

        for field in required_user_fields:
            if not getattr(user, field):
                missing.append(field)

        if custom_user:
            for field in required_custom_fields:
                if not getattr(custom_user, field):
                    missing.append(field)
        else:
            missing.extend(required_custom_fields)

        if missing:
            missing_fields_labels = [field_labels.get(field, field) for field in missing]
            raise PermissionDenied(f"Tu perfil está incompleto. Faltan: {', '.join(missing_fields_labels)}.")

    @action(detail=True, methods=["delete"], url_path="delete-all")
    def delete_all(self, request, pk=None):
        self._check_user_data_complete()
        person = self.get_object()

        person.is_deleted = True
        person.save()
        
        return Response({"detail": "Persona marcada como eliminada."}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=["post"], url_path="active-person")
    def active_person(self, request, pk=None):
        self._check_user_data_complete()

        person = self.get_object()
        print(person)

        if not person.is_deleted:
            return Response({"detail": "La persona ya está activa."}, status=status.HTTP_400_BAD_REQUEST)

        person.is_deleted = False
        person.save()

        return Response({"detail": "Persona activada correctamente."}, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=["get"], url_path="generate-qr")
    def generate_qr(self, request, pk=None):
        person = self.get_object()
        data = {"person_id": person.id}

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)

        qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")

        logo = Image.open("static/logo-sinfondo.png").convert("RGBA")
        qr_width, qr_height = qr_img.size

        logo_size = int(qr_width * 0.8)
        logo = logo.resize((logo_size, logo_size))

        alpha = logo.split()[3]
        alpha = ImageEnhance.Brightness(alpha).enhance(0.3)  # 0.5 = 50% de opacidad
        logo.putalpha(alpha)

        pos = (
            (qr_width - logo_size) // 2,
            (qr_height - logo_size) // 2,
        )

        qr_img.paste(logo, pos, mask=logo)

        buffer = io.BytesIO()
        qr_img.save(buffer, format="PNG")
        image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return Response({
            "detail": "QR generado con logo transparente.",
            "qr_image_base64": f"data:image/png;base64,{image_base64}",
        })

class AmbulanceServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = AmbulanceService.objects.all()
    serializer_class = AmbulanceServiceSerializer



class MedicalCoverageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MedicalCoverage.objects.all()
    serializer_class = MedicalCoverageSerializer