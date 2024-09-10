import { Arl } from "./Arl";
import { Comun } from "./Comun";
import { CompanySize, MisionalitySizeCriteria, Mission } from "./Dedication";
import { Compliance } from "./Diagnosis";
import { IUser } from "./IUser";
import { Segment } from "./Segment";

export interface Diagnosis {
  id: number;
  company: number;
  company_detail: Company;
  date_elabored: Date;
  is_finalized: boolean;
  in_progress: boolean;
  diagnosis_step: number;
  type: number;
  type_detail: Compliance | null;
  consultor: number;
  consultor_detail: IUser | null;
  mode_ejecution: string | null;
  schedule: string | null;
  sequence: string | null;
  observation: string | null;
  corporate_group: number | null;
  external_count_complete: boolean;
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
  mission: number;
  mission_detail: Mission;
  arl: number;
  arl_detail: Arl;
  size: number;
  size_detail: CompanySize | null;
  misionality_size_criteria: MisionalitySizeCriteria[];
  ciius: number[] | null;
  ciius_detail: Ciiu[] | null;
  company_diagnosis: Diagnosis[];
  enable_for_counting: boolean;
}

export type CompanyDTO = {
  name: string;
  nit: string;
  segment: number | null;
  dependant: string | null;
  dependant_phone: string | null;
  dependant_position: string | null;
  email: string;
  acquired_certification: string | null;
  mission: number | null;
  size: number | null;
  arl: number | null;
  ciius: number[] | null;
  external_user?: boolean;
  enable_for_counting: boolean;
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
  quantity_employees: number;
  vehicle_question: number;
  vehicle_question_detail: VehicleQuestion;
  diagnosis_counter: number;
  diagnosis_counter_detail: Diagnosis;
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
  quantity_employees: number;
};

export interface DriverQuestion extends Comun {}

export interface Driver extends Comun {
  quantity: number;
  driver_question: number;
  driver_question_detail: DriverQuestion;
  diagnosis_counter: number;
  diagnosis_counter_detail: Diagnosis;
}

export type DriverDTO = {
  quantity: number;
  driver_question: number;
};

export type SaveQuestionsDTO = {
  company: number;
  external_count_complete?: boolean;
  consultor: number;
  vehicleData: FleetDTO[];
  driverData: DriverDTO[];
};

export type SaveQuestionsForCorporateDTO = {
  company: number;
  corporate: number;
  consultor: number;
  vehicleData: FleetDTO[];
  driverData: DriverDTO[];
};

export type ResponseSaveQuestions = {
  diagnosis: number;
  vehicleData: FleetDTO[];
  driverData: DriverDTO[];
};
