from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    ADMIN = "admin"
    USER = "user"

    ROLE_NAME_CHOICES = [
        (ADMIN, "Admin"),
        (USER, "User"),
    ]

    name = models.CharField(max_length=10, choices=ROLE_NAME_CHOICES)

    def __str__(self):
        return self.get_name_display()


class Phone(models.Model):
    PERSONAL = "personal"
    WORK = "work"
    EMERGENCY = "emergency"

    PHONE_TYPE_CHOICES = [
        (PERSONAL, "Personal"),
        (WORK, "Work"),
        (EMERGENCY, "Emergency"),
    ]

    number = models.CharField(max_length=20)
    type = models.CharField(max_length=10, choices=PHONE_TYPE_CHOICES)

    def __str__(self):
        return f"{self.get_type_display()}: {self.number}"


class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, blank=True, null=True)
    dni = models.CharField(max_length=20, unique=True)
    birth_date = models.DateField()
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    phones = models.ManyToManyField(Phone, blank=True)

    def __str__(self):
        return self.user.get_full_name()

class QRData(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    data = models.JSONField()

    def __str__(self):
        return f"QR Data for {self.user.first_name} {self.user.last_name}"


class MedicalCoverage(models.Model):
    SOCIAL_SECURITY = "social_security"
    PRIVATE = "private"

    COVERAGE_TYPE_CHOICES = [
        (SOCIAL_SECURITY, "Social Security"),
        (PRIVATE, "Private"),
    ]

    type = models.CharField(max_length=20, choices=COVERAGE_TYPE_CHOICES)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"

class AmbulanceService(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Person(models.Model):
    name = models.CharField(max_length=255)
    dni = models.CharField(max_length=20, unique=True)
    age = models.CharField(max_length=3)
    personal_phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    phones = models.ManyToManyField(Phone, blank=True)
    medical_coverage = models.ManyToManyField(MedicalCoverage, blank=True)
    ambulance_service = models.ManyToManyField(AmbulanceService, blank=True)
    company_phones = models.ManyToManyField(Phone, related_name="company_phones", blank=True)
    retired = models.BooleanField(default=False) # Jubilado
    blood_type = models.CharField(max_length=10) # Tipo de sangre
    medication_allergies = models.TextField(blank=True, null=True)
    takes_medication = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    patient_status = models.CharField(max_length=255, blank=True, null=True)
    organ_donor = models.BooleanField(default=False)
    private = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_persons")
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="updated_persons")
    qr = models.ForeignKey(QRData, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name
