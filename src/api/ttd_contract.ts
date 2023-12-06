import axios from 'axios';

import { axiosInstance } from './request';

export const listContractApi = {
  getListContract(status: string): Promise<any> {
    return axiosInstance.get(`/user/sale/contract?status=${status}`);
  },
  createContract(data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/create`, data);
  },
  updateContract(id: string, data: any): Promise<any> {
    return axiosInstance.post(`/admin/contract/update/${id}`, data);
  },
  getUrlIconSocial(formData: any): Promise<any> {
    return axios.post(`https://api.cloudinary.com/v1_1/dbkgkyh4h/image/upload`, formData);
  },
};
