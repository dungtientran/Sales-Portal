import type { DataType } from './index.interface';
import type { DatePickerProps } from 'antd';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Drawer, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { listEmployeeApi } from '@/api/ttd_list_employee';
import HeadTitle from '@/pages/components/head-title/HeadTitle';

const { Text, Title } = Typography;

import { useSelector } from 'react-redux';

import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';

import { Column } from './columns';

const { getListEmployee } = listEmployeeApi;

export const salePosition = ['Trưởng phòng', 'Giám đốc kinh doanh', 'Giám đốc khối', 'Giám đốc vùng'];

const MembershipCommission: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const [listCustomerSp, setListCustomerSp] = useState<DataType[]>([]);
  const [customerSelect, setCustomerSelect] = useState<any>();

  const { user } = useSelector(state => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListEmployee'],
    queryFn: () => getListEmployee(),
  });

  const onClose = () => {
    setOpen(false);
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
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
    <div className="aaa" style={{ padding: '0 12px' }}>
      <HeadTitle title="Hoa hồng thành viên" />
      <Space direction="vertical">
        <Space direction="vertical">
          <Text strong>Chọn kỳ: </Text>
          <Space>
            <DatePicker onChange={onChange} picker="month" format="MM/YYYY" />
            <Button type="primary">Tính toán</Button>
          </Space>
        </Space>
      </Space>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size="large">
          <Title level={4}>Tổng hoa hồng trong kỳ:</Title>
          <Title level={3}>{Number(12345645).toLocaleString()}</Title>
        </Space>
        <ExportExcel />
      </div>
      <div>
        <Title level={4}>Hoa hồng cá nhân</Title>
        {/* <Result total={total} isButtonExcel={false} /> */}
        <div className="table_user">
          <Table
            columns={Column(listCustomerSp, setTotal)}
            rowKey={record => record.id}
            dataSource={[]}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
          />
        </div>
      </div>

      <div>
        <Title level={4}>Hoa hồng vị trí trưởng phòng</Title>
        {/* <Result total={total} isButtonExcel={false} /> */}
        <div className="table_user">
          <Table
            columns={Column(listCustomerSp, setTotal, 'saleManager')}
            rowKey={record => record.id}
            dataSource={[]}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
          />
        </div>
      </div>

      {user?.SaleLevel?.level >= 2 && (
        <div>
          <Title level={4}>Hoa hồng vị trí giám đốc</Title>
          {/* <Result total={total} isButtonExcel={false} /> */}
          <div className="table_user">
            <Table
              columns={Column(listCustomerSp, setTotal, 'manager')}
              rowKey={record => record.id}
              dataSource={[]}
              scroll={{ x: 'max-content', y: '100%' }}
              style={{ height: 'auto' }}
            />
          </div>
        </div>
      )}

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

export default MembershipCommission;
