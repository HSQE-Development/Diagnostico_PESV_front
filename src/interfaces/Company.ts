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
}

export type CompanyDTO = {
    name: string;
    nit: string;
    size: number;
    segment: number;
    dependant: string | null;
    dependant_phone: string | null;
    activities_ciiu: string | null;
    email: string;
    acquired_certification: string | null;
    diagnosis: string | null;
}