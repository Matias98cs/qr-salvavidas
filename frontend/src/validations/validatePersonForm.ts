import { Person } from "@/interfaces/persons/person.interface";
import { Errors } from "@/interfaces/user.interface";

export const validatePersonForm = (personData: Person): { isValid: boolean; errors: Errors } => {
  const newErrors: Errors = {};

  if (!personData.name?.trim()) newErrors.name = "El nombre es obligatorio.";
  if (!personData.last_name?.trim()) newErrors.last_name = "El apellido es obligatorio.";
  if (!personData.email?.trim()) newErrors.email = "El email es obligatorio.";
  if (!personData.dni?.trim()) newErrors.dni = "El DNI es obligatorio.";

  if (!personData.birth_date?.trim()) {
    newErrors.birth_date = "La fecha de nacimiento es obligatoria.";
  } else {
    const birth = new Date(personData.birth_date);
    const today = new Date();
    if (birth > today) {
      newErrors.birth_date = "La fecha de nacimiento no puede ser futura.";
    }
  }

  if (!personData.personal_phone?.trim()) {
    newErrors.personal_phone = "El teléfono personal es obligatorio.";
  }

  if (!personData.blood_type?.trim()) {
    newErrors.blood_type = "El tipo de sangre es obligatorio.";
  }

  if (!personData.country?.trim()) {
    newErrors.country = "El país de residencia es obligatorio.";
  }

  if (!personData.nationality?.trim()) {
    newErrors.nationality = "La nacionalidad es obligatoria.";
  }

  if (!personData.province?.trim()) {
    newErrors.province = "La provincia es obligatoria.";
  }

  if (
    !Array.isArray(personData.medical_coverage_ids) ||
    personData.medical_coverage_ids.length === 0
  ) {
    newErrors.medicalCoverage = "La cobertura médica es obligatoria.";
  }

  if (
    !Array.isArray(personData.ambulance_service_ids) ||
    personData.ambulance_service_ids.length === 0
  ) {
    newErrors.medicalService = "El servicio de ambulancia es obligatorio.";
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};
