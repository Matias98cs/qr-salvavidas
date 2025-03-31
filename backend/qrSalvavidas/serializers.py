from rest_framework import serializers
from .models import Person, MedicalCoverage, AmbulanceService, QRData
from users.models import Phone
from users.serializers import PhoneSerializer


class MedicalCoverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalCoverage
        fields = ['id', 'type', 'name']


class AmbulanceServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmbulanceService
        fields = ['id', 'name']


class QRDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRData
        fields = ['id', 'data']


class PersonSerializer(serializers.ModelSerializer):
    phones = PhoneSerializer(many=True, read_only=True)
    company_phones = PhoneSerializer(many=True, read_only=True)
    medical_coverage = MedicalCoverageSerializer(many=True, read_only=True)
    ambulance_service = AmbulanceServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = [
            'id', 'name', 'dni', 'age', 'personal_phone', 'email',
            'phones', 'company_phones', 'medical_coverage', 'ambulance_service',
            'retired', 'blood_type', 'medication_allergies', 'takes_medication',
            'medical_history', 'patient_status', 'organ_donor', 'private',
            'created_by', 'updated_by', 'qr'
        ]


class PersonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'dni', 'age', 'email', 'retired']


class PersonDetailSerializer(serializers.ModelSerializer):
    phones = PhoneSerializer(many=True, required=False)
    company_phones = PhoneSerializer(many=True, required=False)

    medical_coverage_ids = serializers.PrimaryKeyRelatedField(
        queryset=MedicalCoverage.objects.all(), many=True, write_only=True
    )
    ambulance_service_ids = serializers.PrimaryKeyRelatedField(
        queryset=AmbulanceService.objects.all(), many=True, write_only=True
    )

    medical_coverage = serializers.SerializerMethodField()
    ambulance_service = serializers.SerializerMethodField()

    class Meta:
        model = Person
        exclude = ['created_by', 'updated_by']

    def get_medical_coverage(self, obj):
        return MedicalCoverageSerializer(obj.medical_coverage.all(), many=True).data

    def get_ambulance_service(self, obj):
        return AmbulanceServiceSerializer(obj.ambulance_service.all(), many=True).data


    def create(self, validated_data):
        phones_data = validated_data.pop('phones', [])
        company_phones_data = validated_data.pop('company_phones', [])
        medical_coverage_data = validated_data.pop('medical_coverage_ids', [])
        ambulance_service_data = validated_data.pop('ambulance_service_ids', [])

        person = Person.objects.create(**validated_data)

        for phone_data in phones_data:
            phone = Phone.objects.create(**phone_data)
            person.phones.add(phone)

        for phone_data in company_phones_data:
            phone = Phone.objects.create(**phone_data)
            person.company_phones.add(phone)

        person.medical_coverage.set(medical_coverage_data)
        person.ambulance_service.set(ambulance_service_data)

        QRData.objects.create(
            person=person,
            data={"person_id": person.id}
        )

        return person

    def update(self, instance, validated_data):
        phones_data = validated_data.pop('phones', None)
        company_phones_data = validated_data.pop('company_phones', None)
        medical_coverage_data = validated_data.pop('medical_coverage_ids', None)
        ambulance_service_data = validated_data.pop('ambulance_service_ids', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if phones_data is not None:
            instance.phones.clear()
            for phone_data in phones_data:
                phone = Phone.objects.create(**phone_data)
                instance.phones.add(phone)

        if company_phones_data is not None:
            instance.company_phones.clear()
            for phone_data in company_phones_data:
                phone = Phone.objects.create(**phone_data)
                instance.company_phones.add(phone)

        if medical_coverage_data is not None:
            instance.medical_coverage.set(medical_coverage_data)

        if ambulance_service_data is not None:
            instance.ambulance_service.set(ambulance_service_data)

        return instance


    def validate_dni(self, value):
        if Person.objects.exclude(pk=self.instance.pk if self.instance else None).filter(dni=value).exists():
            raise serializers.ValidationError("DNI ya está registrado")
        return value

    def validate_email(self, value):
        if value and Person.objects.exclude(pk=self.instance.pk if self.instance else None).filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def validate_age(self, value):
        if value < 1:
            raise serializers.ValidationError("Age must be at least 1.")
        return value

