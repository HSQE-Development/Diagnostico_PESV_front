import { Group } from "./Group";

export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  first_name: string | null;
  last_name: string | null;
  licensia_sst: string | null;
  cedula: string;
  avatar: string | null;
  groups: [number];
  groups_detail: Group[];
  change_password: boolean;
  external_step: number;
}

export type UserDTO = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  licensia_sst: string | null;
  cedula: string;
  avatar?: string | null;
  groups: number[];
};
