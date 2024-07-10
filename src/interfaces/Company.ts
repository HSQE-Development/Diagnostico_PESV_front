import { CompanySize, Dedication } from "./Dedication";
import { IUser } from "./IUser";
import { Segment } from "./Segment";

export interface Company {
  id: number;
  name: string;
  nit: string;
  size: number;
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
  size: number;
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
