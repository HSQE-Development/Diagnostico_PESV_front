export interface Dedication {
  id: number;
  name: string;
}

export interface CompanySize{
    id:number
    name:string
    description:string
    dedication:number
    dedication_detail:Dedication
}