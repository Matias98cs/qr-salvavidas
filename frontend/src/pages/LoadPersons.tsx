import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { countries } from "@/helpers/countries";
import { Errors, Person } from "@/interfaces/persons/person.interface";
import useAmbulanceServices from "@/presentations/persons/hooks/useAmbulanceService";
import useMedicalServices from "@/presentations/persons/hooks/useMedicalService";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { bloodTypesData } from "@/helpers/bloodTypes";
import { validatePersonForm } from "@/validations/validatePersonForm";
import { createPerson } from "@/services/persons/person.service";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function LoadPersons() {
  const { ambulanceServices, isLoadingAS } = useAmbulanceServices();
  const { medicalServices, isLoadingMS } = useMedicalServices();
  const queryClient = useQueryClient();

  const [personData, setPersonData] = useState<Person>({
    email: "",
    name: "",
    last_name: "",
    birth_date: "",
    dni: "",
    personal_phone: "",
    country: "",
    nationality: "",
    retired: false,
    organ_donor: false,
    medication_allergies: "",
    takes_medication: "",
    medical_history: "",
    blood_type: "",
    province: "",
    private: false,
    medical_coverage_ids: [],
    ambulance_service_ids: [],
  });
  const [errors, setErrors] = useState<Errors>({});

  if (isLoadingAS || isLoadingMS) {
    return <div className="text-center pt-10">Cargando...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validatePersonForm(personData);
    setErrors(formErrors);

    if (!isValid) {
      return;
    }

    try {
      await createPerson(personData);
      setPersonData({
        email: "",
        name: "",
        last_name: "",
        birth_date: "",
        dni: "",
        personal_phone: "",
        country: "",
        nationality: "",
        retired: false,
        organ_donor: false,
        medication_allergies: "",
        takes_medication: "",
        medical_history: "",
        blood_type: "",
        province: "",
        private: false,
        medical_coverage_ids: [],
        ambulance_service_ids: [],
      });
      queryClient.invalidateQueries({ queryKey: ["personsList"] });
      toast.success("Persona creada con éxito!");
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        setErrors(error as Errors);
        toast.error("Error al crear la persona.");
      } else {
        toast.error("Ocurrió un error desconocido al crear la persona.");
      }
    }
  };
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Carga de personas</CardTitle>
          <CardDescription>Creacion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  <p className="text-red-500 text-sm">
                    {errors.medicalCoverage}
                  </p>
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
                  <p className="text-red-500 text-sm">
                    {errors.medicalService}
                  </p>
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
                    className={`w-full ${
                      errors.country ? "border-red-500" : ""
                    }`}
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
                  type="number"
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
                  <p className="text-red-500 text-sm">
                    {errors.personal_phone}
                  </p>
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
                  className={
                    errors.medication_allergies ? "border-red-500" : ""
                  }
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
                  <p className="text-red-500 text-sm">
                    {errors.medical_history}
                  </p>
                )}
              </div>

              <div className="col-1 flex flex-col gap-4">
                <div className="flex flex-col space-y-2">
                  <Label>Datos privados</Label>
                  <p className="text-sm text-gray-400">
                    Los datos pueden ser privados o públicos según tu
                    preferencia.
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
    </div>
  );
}
