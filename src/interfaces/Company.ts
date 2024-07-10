import { Comun } from "./Comun";
import { CompanySize, Dedication } from "./Dedication";
import { IUser } from "./IUser";
import { Segment } from "./Segment";

export interface Company extends Comun {
  nit: string;
  segment: number | null;
  segment_detail: Segment;
  dependant: string | null;
  dependant_phone: string | null;
  activities_ciiu: string | null;
  email: string | null;
  acquired_certification: string | null;
  diagnosis: string | null;
  consultor: number;
  consultor_detail: IUser | null;
  dedication: number;
  dedication_detail: Dedication;
  company_size: number;
  company_size_detail: CompanySize;
}

export type CompanyDTO = {
  name: string;
  nit: string;
  segment: number | null;
  consultor: number | null;
  dependant: string | null;
  dependant_phone: string | null;
  activities_ciiu: string | null;
  email: string;
  acquired_certification: string | null;
  diagnosis: string | null;
  dedication: number | null;
  company_size: number | null;
};

export interface VehicleQuestion extends Comun {}

export interface Fleet {
  id: number;
  quantity_owned: number;
  quantity_third_party: number;
  vehicle_question: number;
  vehicle_question_detail: VehicleQuestion;
  company: number;
  company_detail: Company;
}

export type FleetDTO = {
  quantity_owned: number;
  quantity_third_party: number;
  vehicle_question: number;
  company: number;
};

export interface DriverQuestion extends Comun {}

export interface Driver extends Comun {
  quantity: number;
  driver_question: number;
  driver_question_detail: DriverQuestion;
  company: number;
  company_detail: Company;
}

export type DriverDTO = {
  quantity: number;
  driver_question: number;
  company: number;
};
