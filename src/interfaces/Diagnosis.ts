import { Company } from "./Company";
import { Comun } from "./Comun";

export interface DiagnosisRequirement extends Comun {}
export interface DiagnosisType extends Comun {}
export interface Compliance extends Comun {}
export interface DiagnosisQuestions extends Comun {
  cycle: string;
  step: number;
  variable_value: number;
  requirement: number;
  requirement_detail: DiagnosisRequirement;
  diagnosis_type: number;
  diagnosis_type_detail: DiagnosisType;
}

export interface DiagnosisQuestionsGroup {
  step: number;
  requirement_name: string;
  questions: DiagnosisQuestions[];
}

export interface DiagnosisDTO {
  question: number;
  company: number;
  compliance: number;
  obtained_value: number;
  verify_document: string | null;
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
