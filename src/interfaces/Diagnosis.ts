import { Company } from "./Company";
import { Comun } from "./Comun";

export interface DiagnosisRequirement extends Comun {
  cycle: string;
  step: number;
}
export interface DiagnosisType extends Comun {}
export interface Compliance extends Comun {}
export interface DiagnosisQuestions extends Comun {
  variable_value: number;
  requirement: number;
  requirement_detail: DiagnosisRequirement;
  diagnosis_type: number;
  diagnosis_type_detail: DiagnosisType;
  compliance_detail?: Compliance;
}

export interface DiagnosisQuestionsGroup {
  id: number;
  step: number;
  requirement_name: string;
  observation: string;
  cycle: string;
  compliance: Compliance;
  questions: DiagnosisQuestions[];
}

export interface CheckListDTO {
  company: number;
  consultor: number;
  diagnosisDto: DiagnosisDTO[];
  diagnosisRequirementDto: DiagnosisRequirementDTO[];
  diagnosis: number;
}
export interface DiagnosisDTO {
  question: number;
  compliance: number;
  obtained_value: number;
  verify_document: string | null;
  observation: string | null;
  is_articuled: boolean;
}

export interface DiagnosisRequirementDTO {
  requirement: number;
  compliance: number;
  observation: string | null;
}

export interface DiagnosisChecklist {
  id: number;
  obtained_value: number;
  verify_document: string;
  company: number;
  company_detail: Company;
  question: number;
  question_detail: DiagnosisQuestions;
  compliance: number;
  compliance_detail: Compliance;
  observation: string;
}

export interface RadarData {
  cycle: string;
  cycle_percentage: number;
}

interface CountComun {
  compliance_id: number;
  count: number;
}

export interface TotalReport {
  counts: CountComun[];
  general: number;
}

export interface Diagnosis {
  id: number;
  company: number;
  date_elabored: string;
}
