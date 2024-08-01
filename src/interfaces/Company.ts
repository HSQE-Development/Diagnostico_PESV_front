import { Arl } from "./Arl";
import { Comun } from "./Comun";
import { CompanySize, MisionalitySizeCriteria, Mission } from "./Dedication";
import { IUser } from "./IUser";
import { Segment } from "./Segment";

export interface Diagnosis {
  id: number;
  company: number;
  company_detail: Company;
  date_elabored: Date;
}
export interface Ciiu extends Comun {
  code: string;
}
export interface Company extends Comun {
  nit: string;
  segment: number | null;
  segment_detail: Segment;
  dependant: string | null;
  dependant_phone: string | null;
  dependant_position: string | null;
  email: string | null;
  acquired_certification: string | null;
  diagnosis: string | null;
  consultor: number;
  consultor_detail: IUser | null;
  mission: number;
  mission_detail: Mission;
  diagnosis_step: number;
  arl: number;
  arl_detail: Arl;
  size: number;
  size_detail: CompanySize | null;
  misionality_size_criteria: MisionalitySizeCriteria[];
  ciius: number[] | null;
  ciius_detail: Ciiu[] | null;
}

export type CompanyDTO = {
  name: string;
  nit: string;
  segment: number | null;
  consultor: number | null;
  dependant: string | null;
  dependant_phone: string | null;
  dependant_position: string | null;
  email: string;
  acquired_certification: string | null;
  mission: number | null;
  size: number | null;
  arl: number | null;
  ciius: number[] | null;
};

export interface VehicleQuestion extends Comun {}

export interface Fleet {
  id: number;
  quantity_owned: number;
  quantity_third_party: number;
  quantity_arrended: number;
  quantity_contractors: number;
  quantity_intermediation: number;
  quantity_leasing: number;
  quantity_renting: number;
  vehicle_question: number;
  vehicle_question_detail: VehicleQuestion;
  diagnosis: number;
  diagnosis_detail: Diagnosis;
}

export type FleetDTO = {
  quantity_owned: number;
  quantity_third_party: number;
  quantity_arrended: number;
  quantity_contractors: number;
  quantity_intermediation: number;
  quantity_leasing: number;
  quantity_renting: number;
  vehicle_question: number;
};

export interface DriverQuestion extends Comun {}

export interface Driver extends Comun {
  quantity: number;
  driver_question: number;
  driver_question_detail: DriverQuestion;
  diagnosis: number;
  diagnosis_detail: Diagnosis;
}

export type DriverDTO = {
  quantity: number;
  driver_question: number;
};

export type SaveQuestionsDTO = {
  company: number;
  vehicleData: FleetDTO[];
  driverData: DriverDTO[];
};
