from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import Person, AmbulanceService, MedicalCoverage
from .serializers import PersonListSerializer, PersonDetailSerializer, AmbulanceServiceSerializer, MedicalCoverageSerializer
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound

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
        required_fields = ['first_name', 'last_name', 'email']
        missing = [field for field in required_fields if not getattr(user, field)]
        if missing:
            raise PermissionError(f"Your user profile is incomplete. Missing: {', '.join(missing)}")

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

class AmbulanceServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = AmbulanceService.objects.all()
    serializer_class = AmbulanceServiceSerializer



class MedicalCoverageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MedicalCoverage.objects.all()
    serializer_class = MedicalCoverageSerializer