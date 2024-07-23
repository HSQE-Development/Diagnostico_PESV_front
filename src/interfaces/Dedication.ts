import { Comun } from "./Comun";

export interface Mission extends Comun {}

export interface CompanySize extends Comun {}

export interface SizeCriteria extends Comun {
  vehicle_min: number;
  vehicle_max: number | null;
  driver_min: number;
  driver_max: number | null;
}

export interface MisionalitySizeCriteria {
  mission: number;
  mission_detail: Mission;
  size: number;
  size_detail: CompanySize;
  criteria: number;
  criteria_detail: SizeCriteria;
}
