import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  amount: number;
  commission: number;
  content: string;
  customer_code: string;
  date: string;
  staff_code?: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
