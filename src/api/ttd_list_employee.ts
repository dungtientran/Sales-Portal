import { axiosInstance } from './request';

export const listEmployeeApi = {
  getListEmployee(): Promise<any> {
    return axiosInstance.get(`/user/sale/lower-grade`);
  },
};
