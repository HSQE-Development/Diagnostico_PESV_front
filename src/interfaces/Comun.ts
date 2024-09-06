import { TablePaginationConfig } from "antd";
import { SorterResult } from "antd/es/table/interface";

/**
 * Interface que le hereda ID y NAME a todas las interfaces o types, la mayoria lo trae. Porfavor procurar seguir haciendolo
 */
export interface Comun {
  id: number;
  name: string;
}

export interface TableParams<T> {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<T>["field"];
  sortOrder?: SorterResult<TablePaginationConfig>["order"];
  filters?: Record<string, any>;
}

export interface PaginationComun<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CorporateGroupId {
  corporate_id?: number;
}

export interface ColorPalette {
  tailwind: string;
  hex: string;
}

export interface ConfigComun {
  isExternal: boolean;
}
