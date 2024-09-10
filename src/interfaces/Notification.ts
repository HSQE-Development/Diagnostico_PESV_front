import { Diagnosis } from "./Company";
import { IUser } from "./IUser";

export interface Notification {
  id: number;
  user: number;
  user_detail: IUser | null;
  diagnosis: number;
  diagnosis_detail: Diagnosis;
  message: string;
  created_at: string;
  read: boolean;
}
