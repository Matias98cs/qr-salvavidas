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
