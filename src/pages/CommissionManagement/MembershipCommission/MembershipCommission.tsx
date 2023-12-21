import type { DataType } from './index.interface';

import './index.less';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { listCommissionStatistics } from '@/api/ttd_list_commission';
import { listEmployeeApi } from '@/api/ttd_list_employee';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';

const { getListEmployee } = listEmployeeApi;
const { getMembershipCommission } = listCommissionStatistics;

export type QueryFilter = {
  period: string;
  staff_code: string;
};

export const salePosition = ['Trưởng phòng', 'Giám đốc kinh doanh', 'Giám đốc khối', 'Giám đốc vùng'];
const today = moment(new Date()).format('MM-DD-YYYY');

const MembershipCommission: React.FC = () => {
  const [listCustomerSp, setListCustomerSp] = useState<DataType[]>([]);
  const [listStaff, setListStaffr] = useState([]);

  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    period: today,
    staff_code: '',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getMembershipCommission', queryFilter],
    queryFn: () => getMembershipCommission(queryFilter.period),
  });

  const listStaffRessponse = useQuery({
    queryKey: ['getListEmployee'],
    queryFn: () => getListEmployee(),
  });

  const clearFilter = () => {
    return false;
  };

  useEffect(() => {
    if (!data) return;

    if (data) {
      // const columns = data?.data?.rows?.map((item: any) => {
      //   return {
      //     ...item,
      //     level: salePosition[item?.SaleLevel?.level - 1],
      //   };
      // });
      const columns = data?.data;

      if (queryFilter.staff_code) {
        const columnsFilter = columns?.filter((item: DataType) => queryFilter.staff_code === item.staff_code);

        setListCustomerSp(columnsFilter);
      } else {
        setListCustomerSp(columns);
      }
    }
  }, [data]);

  useEffect(() => {
    if (listStaffRessponse?.data?.code === 200) {
      const listStaffCustom = listStaffRessponse?.data?.data?.rows?.map((item: any) => {
        return {
          value: item?.staff_code,
        };
      });

      setListStaffr(listStaffCustom);
    }
  }, [listStaffRessponse?.data?.code]);

  return (
    <div className="aaa" style={{ padding: '0 12px' }}>
      <HeadTitle title="Hoa hồng thành viên" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* <ExportExcel /> */}
      </div>
      <BoxFilter listStaff={listStaff} clearFilter={clearFilter} setQueryFilter={setQueryFilter} />
      <Result total={listCustomerSp?.length} isButtonExcel={false} />
      <div className="">
        <Table
          columns={Column(queryFilter.period)}
          dataSource={listCustomerSp}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default MembershipCommission;
