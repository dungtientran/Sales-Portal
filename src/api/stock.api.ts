import axios from 'axios';

import { axiosInstance } from './request';

export const apiListStock = {
  getStockList(): Promise<any> {
    return axiosInstance.get(`/user/sale/lower-grade`);
  },
  updateLogoStock(data: { logo_url: string; stock_id: string }): Promise<any> {
    return axiosInstance.put(`/stock/update_logo/${data.stock_id}`, {
      logo_url: data.logo_url,
    });
  },
};

export const searchStock = (text: string | null): Promise<any> =>
  axiosInstance
    .get<any>('/stock/search?searchText=' + text)
    .then(({ data }) => data)
    .catch(error => console.log(error));
