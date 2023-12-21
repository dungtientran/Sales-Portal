import { axiosInstance } from './request';

export const listCommissionStatistics = {
  getCommissionStatistics(period: string): Promise<any> {
    return axiosInstance.get(`/user/sale/commission_in_period?period=${period}`);
  },
  getTemporaryCommission(): Promise<any> {
    return axiosInstance.get(`/user/sale/unpaid_commission`);
  },
  getMembershipCommission(period: string): Promise<any> {
    return axiosInstance.get(`/user/sale/subordinate_commission?period=${period}`);
  },
  getDetailsMembershipCommission(staff_code: string, period: string): Promise<any> {
    return axiosInstance.get(`/user/sale/subordinate_commission_in_period_detail/${staff_code}?period=${period}`);
  },
};
