import { axiosInstance } from './request';

export const listCommissionStatistics = {
  getCommissionStatistics(period: string): Promise<any> {
    return axiosInstance.get(`/user/sale/commission_in_period?period=${period}`);
  },
  getTemporaryCommission(): Promise<any> {
    return axiosInstance.get(`/user/sale/unpaid_commission`);
  },
};
