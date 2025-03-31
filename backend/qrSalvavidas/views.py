from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import Person, AmbulanceService, MedicalCoverage
from .serializers import PersonListSerializer, PersonDetailSerializer, AmbulanceServiceSerializer, MedicalCoverageSerializer
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    permission_classes = [permissions.IsAuthenticated]

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
        required_fields = ['first_name', 'last_name', 'email']
        missing = [field for field in required_fields if not getattr(user, field)]
        if missing:
            raise PermissionError(f"Your user profile is incomplete. Missing: {', '.join(missing)}")
    @action(detail=True, methods=["delete"], url_path="delete-all")
    def delete_all(self, request, pk=None):
        self._check_user_data_complete()

        person = self.get_object()

        if hasattr(person, 'qr_data'):
            person.qr_data.delete()

        person.phones.all().delete()
        person.company_phones.all().delete()

        person.delete()

        return Response({"detail": "Persona y datos asociados eliminados correctamente."}, status=status.HTTP_204_NO_CONTENT)
    

class AmbulanceServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = AmbulanceService.objects.all()
    serializer_class = AmbulanceServiceSerializer



class MedicalCoverageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MedicalCoverage.objects.all()
    serializer_class = MedicalCoverageSerializer