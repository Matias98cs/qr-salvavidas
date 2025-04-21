import { Errors, Person } from "@/interfaces/persons/person.interface";
import useAmbulanceServices from "@/presentations/persons/hooks/useAmbulanceService";
import useMedicalServices from "@/presentations/persons/hooks/useMedicalService";
import Loading from "./Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { countries } from "@/helpers/countries";
import { Textarea } from "./ui/textarea";
import { bloodTypesData } from "@/helpers/bloodTypes";

interface FormEditPersonProps {
  personData: Person;
  errors: Errors;
  setErrors: (errors: Errors) => void;
  setPersonData: (person: Person) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormEditPerson({
  personData,
  errors,
  setErrors,
  setPersonData,
  onSubmit,
}: FormEditPersonProps) {
  const { ambulanceServices, isLoadingAS } = useAmbulanceServices();
  const { medicalServices, isLoadingMS } = useMedicalServices();

  if (isLoadingAS || isLoadingMS) {
    return <Loading />;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Edición de una persona</CardTitle>
        <CardDescription>Edición</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                id="email"
                name="email"
                value={personData.email ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, email: e.target.value });
                  setErrors({
                    ...errors,
                    email: "",
                  });
                }}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>DNI</Label>
              <Input
                id="dni"
                name="dni"
                value={personData.dni ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, dni: e.target.value });
                  setErrors({
                    ...errors,
                    dni: "",
                  });
                }}
                className={errors.dni ? "border-red-500" : ""}
              />
              {errors.dni && (
                <p className="text-red-500 text-sm">{errors.dni}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                id="name"
                name="name"
                value={personData.name ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, name: e.target.value });
                  setErrors({
                    ...errors,
                    name: "",
                  });
                }}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input
                id="last_name"
                name="last_name"
                value={personData.last_name ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, last_name: e.target.value });
                  setErrors({
                    ...errors,
                    last_name: "",
                  });
                }}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                value={personData.birth_date ?? ""}
                onChange={(e) => {
                  setPersonData({
                    ...personData,
                    birth_date: e.target.value,
                  });
                  setErrors({
                    ...errors,
                    birth_date: "",
                  });
                }}
                className={errors.birth_date ? "border-red-500" : ""}
              />
              {errors.birth_date && (
                <p className="text-red-500 text-sm">{errors.birth_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cobertura Médica</Label>
              <Select
                value={personData.medical_coverage_ids[0]?.toString() ?? ""}
                onValueChange={(value) => {
                  setPersonData({
                    ...personData,
                    medical_coverage_ids: [parseInt(value)],
                  });
                  setErrors({
                    ...errors,
                    medicalCoverage: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.medicalCoverage ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona una cobertura medica" />
                </SelectTrigger>
                <SelectContent>
                  {medicalServices?.map((medicalCoverage) => (
                    <SelectItem
                      key={medicalCoverage.id}
                      value={medicalCoverage.id.toString() ?? ""}
                    >
                      {medicalCoverage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medicalCoverage && (
                <p className="text-red-500 text-sm">{errors.medicalCoverage}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Hospital (donde se atiende)</Label>
              <Input
                id="hospital"
                name="hospital"
                value={personData.hospital ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, hospital: e.target.value });
                  setErrors({
                    ...errors,
                    hospital: "",
                  });
                }}
                className={errors.hospital ? "border-red-500" : ""}
              />
              {errors.hospital && (
                <p className="text-red-500 text-sm">{errors.hospital}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contacto de emergencia</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="number"
                value={personData.emergency_contact_phone ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, emergency_contact_phone: Number(e.target.value) });
                  setErrors({
                    ...errors,
                    emergency_contact_phone: "",
                  });
                }}
                className={errors.emergency_contact_phone ? "border-red-500" : ""}
              />
              {errors.emergency_contact_phone && (
                <p className="text-red-500 text-sm">{errors.emergency_contact_phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Número de afiliado/plan</Label>
              <Input
                id="insurance_plan"
                name="insurance_plan"
                value={personData.insurance_plan ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, insurance_plan: e.target.value });
                  setErrors({
                    ...errors,
                    insurance_plan: "",
                  });
                }}
                className={errors.insurance_plan ? "border-red-500" : ""}
              />
              {errors.insurance_plan && (
                <p className="text-red-500 text-sm">{errors.insurance_plan}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Servicio de ambulancia</Label>
              <Select
                value={personData.ambulance_service_ids[0]?.toString() ?? ""}
                onValueChange={(value) => {
                  setPersonData({
                    ...personData,
                    ambulance_service_ids: [parseInt(value)],
                  });
                  setErrors({
                    ...errors,
                    medicalService: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.medicalService ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona un servicio de ambulancia" />
                </SelectTrigger>
                <SelectContent>
                  {ambulanceServices?.map((medicalCoverage) => (
                    <SelectItem
                      key={medicalCoverage.id}
                      value={medicalCoverage.id.toString() ?? ""}
                    >
                      {medicalCoverage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medicalService && (
                <p className="text-red-500 text-sm">{errors.medicalService}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>País de residencia</Label>
              <Select
                value={personData.country ?? ""}
                onValueChange={(value) => {
                  setPersonData({ ...personData, country: value });
                  setErrors({
                    ...errors,
                    country: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${errors.country ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code ?? ""}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nacionalidad</Label>
              <Select
                value={personData.nationality ?? ""}
                onValueChange={(value) => {
                  setPersonData({ ...personData, nationality: value });
                  setErrors({
                    ...errors,
                    nationality: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.nationality ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona una nacionalidad" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code ?? ""}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nationality && (
                <p className="text-red-500 text-sm">{errors.nationality}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Provincia</Label>
              <Input
                id="province"
                name="province"
                value={personData.province ?? ""}
                onChange={(e) => {
                  setPersonData({ ...personData, province: e.target.value });
                  setErrors({
                    ...errors,
                    province: "",
                  });
                }}
                className={errors.province ? "border-red-500" : ""}
              />
              {errors.province && (
                <p className="text-red-500 text-sm">{errors.province}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Número personal</Label>
              <Input
                id="personal_phone"
                name="personal_phone"
                type="tel"
                min={0}
                value={personData.personal_phone ?? ""}
                onChange={(e) => {
                  setPersonData({
                    ...personData,
                    personal_phone: e.target.value,
                  });
                  setErrors({
                    ...errors,
                    personal_phone: "",
                  });
                }}
                className={errors.personal_phone ? "border-red-500" : ""}
              />
              {errors.personal_phone && (
                <p className="text-red-500 text-sm">{errors.personal_phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de sangre</Label>
              <Select
                value={personData.blood_type ?? ""}
                onValueChange={(value) => {
                  setPersonData({ ...personData, blood_type: value });
                  setErrors({
                    ...errors,
                    blood_type: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.blood_type ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona el tipo sangre" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypesData?.map((data) => (
                    <SelectItem key={data.id} value={data.value ?? ""}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.blood_type && (
                <p className="text-red-500 text-sm">{errors.blood_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Alérgico a medicamentos (opcional)</Label>
              <Textarea
                id="medication_allergies"
                name="medication_allergies"
                placeholder="
                Ingrese los medicamentos que son alergicos a este paciente.
              "
                value={personData.medication_allergies ?? ""}
                onChange={(e) => {
                  setPersonData({
                    ...personData,
                    medication_allergies: e.target.value,
                  });
                  setErrors({
                    ...errors,
                    medication_allergies: "",
                  });
                }}
                className={errors.medication_allergies ? "border-red-500" : ""}
              />
              {errors.medication_allergies && (
                <p className="text-red-500 text-sm">
                  {errors.medication_allergies}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Consumo de medicamentos (opcional)</Label>
              <Textarea
                id="takes_medication"
                name="takes_medication"
                placeholder="
                Ingrese los medicamentos que toma este paciente.
              "
                value={personData.takes_medication ?? ""}
                onChange={(e) => {
                  setPersonData({
                    ...personData,
                    takes_medication: e.target.value,
                  });
                  setErrors({
                    ...errors,
                    takes_medication: "",
                  });
                }}
                className={errors.takes_medication ? "border-red-500" : ""}
              />
              {errors.takes_medication && (
                <p className="text-red-500 text-sm">
                  {errors.takes_medication}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Historial médico (opcional)</Label>
              <Textarea
                id="medical_history"
                name="medical_history"
                placeholder="
                Ingrese los medicamentos que toma este paciente.
              "
                value={personData.medical_history ?? ""}
                onChange={(e) => {
                  setPersonData({
                    ...personData,
                    medical_history: e.target.value,
                  });
                  setErrors({
                    ...errors,
                    medical_history: "",
                  });
                }}
                className={errors.medical_history ? "border-red-500" : ""}
              />
              {errors.medical_history && (
                <p className="text-red-500 text-sm">{errors.medical_history}</p>
              )}
            </div>

            <div className="col-1 flex flex-col gap-4">
              <div className="flex flex-col space-y-2">
                <Label>Datos privados</Label>
                <p className="text-sm text-gray-400">
                  Los datos pueden ser privados o públicos según tu preferencia.
                </p>
                <Switch
                  checked={personData.private ? true : false}
                  onCheckedChange={(checked) =>
                    setPersonData({ ...personData, private: checked })
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Jubilado</Label>
                <Switch
                  checked={personData.retired ? true : false}
                  onCheckedChange={(checked) =>
                    setPersonData({ ...personData, retired: checked })
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Donante de organos</Label>
                <Switch
                  checked={personData.organ_donor ? true : false}
                  onCheckedChange={(checked) =>
                    setPersonData({ ...personData, organ_donor: checked })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="cursor-pointer">
              Guardar cambios
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
