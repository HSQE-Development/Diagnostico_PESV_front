import { Company, Diagnosis } from "./Company";
import { Comun } from "./Comun";

export interface ICorporateGroup extends Comun {
  company_diagnoses_corporate: ICorporateDiagnosisCompany[];
}

export interface ICorporateDiagnosisCompany {
  id: number;
  company: number;
  company_detail: Company;
  diagnosis: number;
  diagnosis_detail: Diagnosis | null;
}
