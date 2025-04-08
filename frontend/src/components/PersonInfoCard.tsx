import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Person } from "@/interfaces/persons/person.interface";

interface PersonInfoCardProps {
  person: Person;
}

export default function PersonInfoCard({ person }: PersonInfoCardProps) {
  return (
    <Card className="w-full max-w-2xl shadow-lg p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          Información de la Persona
        </CardTitle>
        <CardDescription className="text-center">
          Datos médicos y personales disponibles
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <strong>Nombre:</strong> {person?.name} {person?.last_name}
        </div>
        <div>
          <strong>DNI:</strong> {person?.dni}
        </div>
        <div>
          <strong>Edad:</strong> {person?.age} años
        </div>
        <div>
          <strong>Email:</strong> {person?.email}
        </div>
        <div>
          <strong>Teléfono:</strong> {person?.personal_phone}
        </div>
        <div>
          <strong>País:</strong> {person?.country}
        </div>
        <div>
          <strong>Provincia:</strong> {person?.province}
        </div>
        <div>
          <strong>Tipo de Sangre:</strong> {person?.blood_type}
        </div>
        <div>
          <strong>Donante de Órganos:</strong>{" "}
          {person?.organ_donor ? "Sí" : "No"}
        </div>
        <div>
          <strong>Jubilado:</strong> {person?.retired ? "Sí" : "No"}
        </div>
        <div className="sm:col-span-2">
          <strong>Estado del paciente:</strong>{" "}
          {person?.patient_status ?? "Sin especificar"}
        </div>
        <div className="sm:col-span-2">
          <strong>Historial médico:</strong>{" "}
          {person?.medical_history || "Ninguno"}
        </div>
        <div className="sm:col-span-2">
          <strong>Alergias a medicamentos:</strong>{" "}
          {person?.medication_allergies || "Ninguna"}
        </div>
        <div className="sm:col-span-2">
          <strong>Medicamentos que toma:</strong>{" "}
          {person?.takes_medication || "Ninguno"}
        </div>
        <div className="sm:col-span-2">
          <strong>Cobertura médica:</strong>{" "}
          {person?.medical_coverage?.map((mc) => mc.name).join(", ") ||
            "Ninguna"}
        </div>
        <div className="sm:col-span-2">
          <strong>Servicio de ambulancia:</strong>{" "}
          {person?.ambulance_service?.map((as) => as.name).join(", ") ||
            "Ninguno"}
        </div>
      </CardContent>
    </Card>
  );
}
