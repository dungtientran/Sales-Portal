import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

export interface DataType {
  id: string;
  avatar_url: string;
  fullname: string;
  email: string;
  customer_code: string;
  phone_number: string;
  subscription_product: string;
  nav: number;
  sale_name: string;
  day_remaining: number;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export type DataIndex = keyof DataType;
