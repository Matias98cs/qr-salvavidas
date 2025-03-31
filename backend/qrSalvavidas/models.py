from django.db import models
from django.contrib.auth.models import User
from users.models import CustomUser, Phone, Role


class QRData(models.Model):
    person = models.OneToOneField("Person", on_delete=models.CASCADE, related_name="qr_data", null=True)
    data = models.JSONField()

    def __str__(self):
        return f"QR Data for {self.person.name}"


class MedicalCoverage(models.Model):
    SOCIAL_SECURITY = "social_security"
    PRIVATE = "private"

    COVERAGE_TYPE_CHOICES = [
        (SOCIAL_SECURITY, "Social Security"),
        (PRIVATE, "Private"),
    ]

    type = models.CharField(max_length=20, choices=COVERAGE_TYPE_CHOICES)
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('type', 'name')

    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"


class AmbulanceService(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Person(models.Model):
    BLOOD_TYPES = [
        ("A+", "A+"), ("A-", "A-"), ("B+", "B+"), ("B-", "B-"),
        ("AB+", "AB+"), ("AB-", "AB-"), ("O+", "O+"), ("O-", "O-")
    ]

    name = models.CharField(max_length=255)
    dni = models.CharField(max_length=20, unique=True)
    age = models.PositiveSmallIntegerField()
    personal_phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    phones = models.ManyToManyField(Phone, blank=True)
    company_phones = models.ManyToManyField(Phone, related_name="company_phones", blank=True)
    medical_coverage = models.ManyToManyField(MedicalCoverage, blank=True)
    ambulance_service = models.ManyToManyField(AmbulanceService, blank=True)
    retired = models.BooleanField(default=False)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPES)
    medication_allergies = models.TextField(blank=True, null=True)
    takes_medication = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    patient_status = models.CharField(max_length=255, blank=True, null=True)
    organ_donor = models.BooleanField(default=False)
    private = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_persons")
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="updated_persons")

    def __str__(self):
        return self.name