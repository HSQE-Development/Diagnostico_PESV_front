import { Diagnosis } from "@/interfaces/Company";
import React from "react";

interface CompanydiagnosisProps {
  diagnosis: Diagnosis[];
}
export default function CompanyDiagnosis({ diagnosis }: CompanydiagnosisProps) {
  return <>{diagnosis.map((diagnostic) => diagnostic.id)}</>;
}
