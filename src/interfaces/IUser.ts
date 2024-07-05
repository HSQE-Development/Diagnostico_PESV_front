export interface IUser {
    id: number;
    username: string;
    email: string;
    password?: string;
    first_name: string|null
    last_name: string | null
    licensia_sst: string | null
    cedula:string
  }