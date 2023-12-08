import type { DataType, TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listEmployeeApi } from '@/api/ttd_list_employee';
import EditUserManagement from '@/pages/components/form/form-edit-user-manage';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { getListEmployee } = listEmployeeApi;

export const salePosition = ['Trưởng phòng', 'Giám đốc kinh doanh', 'Giám đốc khối', 'Giám đốc vùng'];

const ListOfEmployee: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [listCustomerSp, setListCustomerSp] = useState<DataType[]>([]);
  const [queryFilter, setQueryFilter] = useState<string>('');
  const [customerSelect, setCustomerSelect] = useState<any>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListEmployee'],
    queryFn: () => getListEmployee(),
  });

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!data) return;

    if (data) {
      const columns = data?.data?.rows?.map((item: any) => {
        return {
          ...item,
          level: salePosition[item?.SaleLevel?.level - 1],
        };
      });

      setListCustomerSp(columns);
      setTotal(data?.data?.count);
    }
  }, [data]);

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách nhân viên" />
      {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true), setCustomerSelect(undefined);
          }}
        >
          Tạo quản trị viên mới
        </Button>
      </div> */}
      <Result total={total} isButtonExcel={false} />
      <div className="table_user">
        <Table
          columns={Column(listCustomerSp, setTotal)}
          rowKey={record => record.id}
          dataSource={listCustomerSp}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>
      <Drawer
        title={!customerSelect ? 'Tạo mới quản trị viên' : 'Chỉnh sửa '}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {/* <EditUserManagement initForm={customerSelect} useSale={useSale} /> */}
      </Drawer>
    </div>
  );
};

export default ListOfEmployee;
