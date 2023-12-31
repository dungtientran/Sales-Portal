import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  contract_commission: number;
  director_commission: number;
  manager_commission: number;
  period: string;
  staff_code: string;
  sub_commission: number;
  total: number;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
