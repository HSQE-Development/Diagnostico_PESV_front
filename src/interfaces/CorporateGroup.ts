import { Company, Diagnosis } from "./Company";
import { Comun, PaginationComun } from "./Comun";

export interface ICorporateGroup extends Comun {
  company_diagnoses_corporate: ICorporateDiagnosisCompany[];
}

export interface CorporateGroupPagination
  extends PaginationComun<ICorporateGroup> {}

export interface ICorporateDiagnosisCompany {
  id: number;
  company: number;
  company_detail: Company;
  diagnosis: number;
  diagnosis_detail: Diagnosis | null;
}

export interface CorporateDTO {
  name: string;
  companies: number[];
  diagnosis: number[] | null;
}
