import type { DataType } from './index.interface';
import type { DatePickerProps } from 'antd';

import './index.less';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Drawer, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';

import HeadTitle from '@/pages/components/head-title/HeadTitle';

const { Text, Title } = Typography;

import moment from 'moment';
import { useSelector } from 'react-redux';

import { listCommissionStatistics } from '@/api/ttd_list_commission_statistics';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';

import ExportExcelButton from '../BtnExportExcel/BtnExportExcel';
import { Column } from './columns';

const { getTemporaryCommission } = listCommissionStatistics;

export const salePosition = ['Trưởng phòng', 'Giám đốc kinh doanh', 'Giám đốc khối', 'Giám đốc vùng'];

const TemporaryCommission: React.FC = () => {
  const queryClient = useQueryClient();

  const [totalCommession, setTotalCommession] = useState(0);

  const [listSale, setListSale] = useState<DataType[]>([]);
  const [listManager, setListManager] = useState<DataType[]>([]);
  const [listDirector, setListDirector] = useState<DataType[]>([]);

  const [totalSale, setTotalSale] = useState(0);
  const [totalManager, setTotalManager] = useState(0);
  const [totalDirector, setTotalDirector] = useState(0);

  const { user } = useSelector(state => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getTemporaryCommission'],
    queryFn: () => getTemporaryCommission(),
  });

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    if (!data) return;

    if (data) {
      const columnsSale = data?.data?.contract?.sale?.map((item: any) => {
        setTotalSale(prev => prev + (item?.commission || 0));

        return {
          ...item,
          date: moment(item?.date).format('DD/MM/YYYY'),
          content: item?.content
            ?.split('_')
            ?.map((text: string) => text.charAt(0).toUpperCase() + text.slice(1))
            ?.join(' '),
        };
      });
      const columnsManager = data?.data?.contract?.manager?.map((item: any) => {
        setTotalManager(prev => prev + (item?.commission || 0));

        return {
          ...item,
          date: moment(item?.date).format('DD/MM/YYYY'),
          content: item?.content
            ?.split('_')
            ?.map((text: string) => text.charAt(0).toUpperCase() + text.slice(1))
            ?.join(' '),
          staff_code: item?.staff_code,
        };
      });
      const columnsDirector = data?.data?.contract?.director?.map((item: any) => {
        setTotalDirector(prev => prev + (item?.commission || 0));

        return {
          ...item,
          date: moment(item?.date).format('DD/MM/YYYY'),
          content: item?.content
            ?.split('_')
            ?.map((text: string) => text.charAt(0).toUpperCase() + text.slice(1))
            ?.join(' '),
          staff_code: item?.staff_code,
        };
      });

      setListSale(columnsSale);
      setListManager(columnsManager);
      setListDirector(columnsDirector);
      setTotalCommession(data?.data?.total);
    }
  }, [data]);

  return (
    <div className="aaa" style={{ padding: '0 12px' }}>
      <HeadTitle title="Hoa hồng tạm tính" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size="large">
          <Title level={4}>Tổng hoa hồng tạm tính:</Title>
          <Title level={3}>{Number(totalCommession).toLocaleString()}</Title>
        </Space>
        <ExportExcelButton
          dataSource1={listSale}
          dataSource2={listManager}
          dataSource3={listDirector}
          columns1={Column()}
          columns2={Column('saleManager')}
          columns3={Column('manager')}
          title="Hoa hồng tạm tính"
          disable={isLoading}
          saleLevel={user?.SaleLevel?.level}
        />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4}>Hoa hồng cá nhân</Title>
          <Space>
            <Text>Tổng:</Text>
            <Text strong>{Number(totalSale).toLocaleString()}</Text>
          </Space>
        </div>

        <div className="table_user">
          <Table
            columns={Column()}
            dataSource={listSale}
            loading={isLoading}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4}>Hoa hồng vị trí trưởng phòng</Title>
          <Space>
            <Text>Tổng:</Text>
            <Text strong>{Number(totalManager).toLocaleString()}</Text>
          </Space>
        </div>
        <div className="table_user">
          <Table
            columns={Column('saleManager')}
            dataSource={listManager}
            loading={isLoading}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
          />
        </div>
      </div>

      {user?.SaleLevel?.level >= 2 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={4}>Hoa hồng vị trí giám đốc</Title>
            <Space>
              <Text>Tổng:</Text>
              <Text strong>{Number(totalDirector).toLocaleString()}</Text>
            </Space>
          </div>
          <div className="table_user">
            <Table
              columns={Column('manager')}
              dataSource={listDirector}
              loading={isLoading}
              scroll={{ x: 'max-content', y: '100%' }}
              style={{ height: 'auto' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporaryCommission;
