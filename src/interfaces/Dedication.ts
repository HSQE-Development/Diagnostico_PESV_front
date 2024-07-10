import { Comun } from "./Comun";

export interface Dedication extends Comun {}

export interface CompanySize extends Comun {
  description: string;
  dedication: number;
  dedication_detail: Dedication;
}
