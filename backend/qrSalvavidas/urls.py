from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonViewSet, AmbulanceServiceViewSet, MedicalCoverageViewSet

router = DefaultRouter()
router.register(r'persons', PersonViewSet, basename='persons')
router.register(r'ambulance-services', AmbulanceServiceViewSet)
router.register(r'medical-coverages', MedicalCoverageViewSet)


urlpatterns = router.urls
