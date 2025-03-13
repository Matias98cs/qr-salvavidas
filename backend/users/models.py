from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField  # 🔹 Para manejar países válidos

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

    user = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="phones", blank=True, null=True)
    country_code = models.CharField(max_length=5, blank=True, null=True)  # 🔹 Codigo de país (ejemplo: +54 para Argentina)
    area_code = models.CharField(max_length=5, blank=True, null=True)  # 🔹 Codigo de area (ejemplo: 351 para Cordoba)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    type = models.CharField(max_length=10, choices=PHONE_TYPE_CHOICES)

    class Meta:
        unique_together = ('country_code', 'area_code', 'phone_number')

    def __str__(self):
        return f"{self.get_type_display()} - {self.country_code} {self.area_code} {self.phone_number}"



class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, blank=True, null=True)
    dni = models.CharField(max_length=20, unique=True)
    birth_date = models.DateField(null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    country = CountryField(blank=True, null=True)  # 🔹 Usa django-countries para países válidos
    province = models.CharField(max_length=100, blank=True, null=True)  # 🔹 Provincia/Estado
    nationality = CountryField(blank=True, null=True, verbose_name="Nationality")  # 🔹 Nacionalidad del usuario

    def __str__(self):
        return self.user.get_full_name()