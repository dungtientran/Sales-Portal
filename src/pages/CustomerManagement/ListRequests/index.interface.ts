import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  id: string;
  address: string | null;
  budget: string;
  created_at: string;
  email: string;
  is_contact: boolean;
  name: string;
  phone_number: string;
  type: string;
  updated_at: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
