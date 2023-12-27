/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import type { DataType } from './index.interface';
import type { DatePickerProps } from 'antd';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Drawer, Skeleton, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import HeadTitle from '@/pages/components/head-title/HeadTitle';

const { Text, Title } = Typography;

import type { RangePickerProps } from 'antd/es/date-picker';

import moment from 'moment';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { listCommissionStatistics } from '@/api/ttd_list_commission';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';

import { Column } from './columns';

const { getDetailsMembershipCommission } = listCommissionStatistics;

const today = moment(new Date()).format('YYYY/MM');

const disabledDate: RangePickerProps['disabledDate'] = current => {
  return current && current > dayjs().subtract(1, 'month').endOf('month');
};

const Details: React.FC = () => {
  const { id } = useParams();
  const [searchParams, _] = useSearchParams();
  const period = searchParams.get('period');

  const [listSub, setListSub] = useState<DataType[]>([]);
  const [listCommession, setListCommession] = useState<DataType[]>([]);
  const [listManager, setListManager] = useState<DataType[]>([]);
  const [listDirector, setListDirector] = useState<DataType[]>([]);

  const [totalSale, setTotalSale] = useState(0);
  const [totalCommession, setTotalCommession] = useState(0);
  const [totalManager, setTotalManager] = useState(0);
  const [totalDirector, setTotalDirector] = useState(0);

  const { user } = useSelector(state => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getMembershipCommission', period, id],
    queryFn: () => getDetailsMembershipCommission(id as string, `${period}`),
  });

  useEffect(() => {
    if (!data) return;

    if (data) {
      // eslint-disable-next-line prefer-const
      let totalSubResponse = 0;
      let totalCommessionResponse = 0;
      // eslint-disable-next-line prefer-const
      let totalManagerResponse = 0;
      // eslint-disable-next-line prefer-const
      let totalDirectorResponse = 0;

      const columnsSub = data?.data?.contract?.sub?.map((item: any) => {
        totalCommessionResponse+=item?.commission
        setTotalCommession(totalCommessionResponse);

        return {
          ...item,
          date: moment(item?.date).format('DD/MM/YYYY'),
          content: item?.content
            ?.split('_')
            ?.map((text: string) => text.charAt(0).toUpperCase() + text.slice(1))
            ?.join(' '),
        };
      });

      const columnsCommession = data?.data?.contract?.sale?.map((item: any) => {
        totalCommessionResponse+=item?.commission
        setTotalCommession(totalCommessionResponse);

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

      setListSub(columnsSub);
      setListCommession(columnsCommession);
      setListManager(columnsManager);
      setListDirector(columnsDirector);
      // setTotalCommession(data?.data?.total);
    }
  }, [data]);

  return (
    <div className="aaa" style={{ padding: '0 12px' }}>
      <HeadTitle title="Chi tiết hoa hồng thành viên" />
     <Space direction='vertical' size='small'>
     <Space size="large">
        <Title level={4}>Kỳ:</Title>
        <Title level={3}>{moment(period).format('YYYY/MM')}</Title>
      </Space>
      <Space size="large">
        <Title level={4}>Tổng:</Title>
        <Title level={3}>{data?.data?.total?.toLocaleString()}</Title>
      </Space>
     </Space>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4}>Hoa hồng từ đăng ký</Title>
          <Space>
            <Text>Tổng:</Text>
            <Text strong>{Number(totalSale).toLocaleString()}</Text>
          </Space>
        </div>
        {/* <Result total={total} isButtonExcel={false} /> */}
        <div className="">
          <Table
            columns={Column()}
            dataSource={listSub}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
            loading={isLoading}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4}>Hoa hồng từ hợp đồng thanh lý</Title>
          <Space>
            <Text>Tổng:</Text>
            <Text strong>{Number(totalCommession).toLocaleString()}</Text>
          </Space>
        </div>
        <div className="">
          <Table
            columns={Column('commission')}
            dataSource={listCommession}
            scroll={{ x: 'max-content', y: '100%' }}
            style={{ height: 'auto' }}
            loading={isLoading}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4}>Hoa hồng từ vị trí trưởng phòng</Title>
          <Space>
            <Text>Tổng:</Text>
            <Text strong>{Number(totalManager).toLocaleString()}</Text>
          </Space>
        </div>
        <div className="">
          <Table
            columns={Column('manager')}
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
            <Title level={4}>Hoa hồng từ vị trí giám đốc</Title>
            <Space>
              <Text>Tổng:</Text>
              <Text strong>{Number(totalDirector).toLocaleString()}</Text>
            </Space>
          </div>
          <div className="">
            <Table
              columns={Column('director')}
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

export default Details;
