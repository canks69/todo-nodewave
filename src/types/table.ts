export type FilterValue = string | number | boolean;
export type FilterValues = FilterValue | FilterValue[];
export type Filters = Record<string, FilterValues>;

export type TableFilters = Filters;
export type FilterHandler = (filters: Filters) => void;
export type SearchHandler = (search: string) => void;
export type PaginationHandler = (pagination: PaginationState) => void;

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface MetaResponse {
  totalData: number;
  totalPage: number;
}

export interface DataTableParams {
  page?: number; 
  limit?: number;
  searchFilters?: Record<string, string>;
  sortBy?: [string, 'asc' | 'desc'][];
  filters?: Filters;
}
