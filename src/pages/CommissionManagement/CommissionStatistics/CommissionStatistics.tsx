import type { DataType } from './index.interface';
import type { DatePickerProps } from 'antd';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Drawer, Skeleton, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import HeadTitle from '@/pages/components/head-title/HeadTitle';

const { Text, Title } = Typography;

import moment from 'moment';
import { useSelector } from 'react-redux';

import { listCommissionStatistics } from '@/api/ttd_list_commission_statistics';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';

import ExportExcelButton from '../BtnExportExcel/BtnExportExcel';
import { Column } from './columns';

const { getCommissionStatistics } = listCommissionStatistics;

const today = moment(new Date()).format('YYYY/MM');

const CommissionStatistics: React.FC = () => {
  const queryClient = useQueryClient();

  const [totalCommession, setTotalCommession] = useState(0);

  const [listSale, setListSale] = useState<DataType[]>([]);
  const [listManager, setListManager] = useState<DataType[]>([]);
  const [listDirector, setListDirector] = useState<DataType[]>([]);

  const [totalSale, setTotalSale] = useState(0);
  const [totalManager, setTotalManager] = useState(0);
  const [totalDirector, setTotalDirector] = useState(0);

  const [period, setPeriod] = useState(`${today}/01`);

  const { user } = useSelector(state => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getCommissionStatistics', period],
    queryFn: () => getCommissionStatistics(period),
  });

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setPeriod(dateString);
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
      <HeadTitle title="Thống kê hoa hồng" />
      <Space direction="vertical">
        <Space direction="horizontal">
          <Text strong>Chọn kỳ: </Text>
          <Space>
            <DatePicker defaultValue={dayjs(today, 'YYYY/MM')} format={'YYYY/MM'} picker="month" onChange={onChange} />
          </Space>
        </Space>
      </Space>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size="large">
          <Title level={4}>Tổng hoa hồng trong kỳ:</Title>
          <Title level={3}>{Number(totalCommession).toLocaleString()}</Title>
          <Skeleton />
        </Space>
        <ExportExcelButton
          dataSource1={listSale}
          dataSource2={listManager}
          dataSource3={listDirector}
          columns1={Column()}
          columns2={Column('saleManager')}
          columns3={Column('manager')}
          title="Thống kê hoa hồng"
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
        {/* <Result total={total} isButtonExcel={false} /> */}
        <div className="">
          <Table
            columns={Column()}
            dataSource={listSale}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
            loading={isLoading}
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
        <div className="">
          <Table
            columns={Column('saleManager')}
            dataSource={listManager}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
            loading={isLoading}
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
          <div className="">
            <Table
              columns={Column('manager')}
              dataSource={listDirector}
              scroll={{ x: 'max-content', y: '100%' }}
              style={{ height: 'auto' }}
              loading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionStatistics;
