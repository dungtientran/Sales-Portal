import type { QueryFilter } from './MembershipCommission';
import type { TableParams } from '@/pages/CustomerManagement/ListCustomers/index.interface';
import type { filterQueryType } from '@/pages/CustomerManagement/ListCustomers/ListCustomers';
import type { DatePickerProps } from 'antd';
import type { Dispatch, SetStateAction } from 'react';

import { AutoComplete, Button, DatePicker, InputNumber, Radio, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';

const { Text } = Typography;
const { Option } = Select;

interface IBoxFilter {
  clearFilter: () => void;
  setQueryFilter: (query: QueryFilter) => void;
  listStaff: any;
}

const today = moment(new Date()).format('YYYY/MM');

const BoxFilter = ({ clearFilter, listStaff, setQueryFilter }: IBoxFilter) => {
  const [careby, setCareby] = useState<string>('');
  const [optionSalePosition, setOptionSalePosition] = useState<{ value: string }[]>([]);
  const [selectedDates, setSelectedDates] = useState<any>(dayjs(today, 'YYYY/MM'));

  const [queryFilter, setQueryFilterr] = useState<QueryFilter>({
    staff_code: careby,
    period: moment(today).format('MM-DD-YYYY'),
  });

  const handleFilter = () => {
    setQueryFilter(queryFilter);
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setSelectedDates(date);
    setQueryFilterr(prev => ({ ...prev, period: moment(dateString).format('MM-DD-YYYY') }));
  };

  useEffect(() => {
    setOptionSalePosition(listStaff);
  }, [listStaff]);

  return (
    <Space
      direction="vertical"
      size={'middle'}
      style={{ margin: '20px 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Space>
        <div style={{ width: '100px' }}>
          <Text strong>Mã nhân viên: </Text>
        </div>

        <AutoComplete
          options={optionSalePosition}
          placeholder="Mã nhân viên"
          filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          size="large"
          onChange={value => {
            setCareby(value);
            setQueryFilterr(prev => ({ ...prev, staff_code: value }));
          }}
          value={careby}
          style={{ width: '200px', padding: '0' }}
        />
      </Space>

      <Space>
        <div style={{ width: '100px' }}>
          <Text strong>Kỳ: </Text>
        </div>

        <DatePicker
          format={'YYYY/MM'}
          picker="month"
          onChange={onChange}
          style={{ width: '200px', padding: '8px' }}
          value={selectedDates}
        />
      </Space>

      <Space>
        <Button onClick={handleFilter}>Lọc</Button>
        <Button
          onClick={() => {
            clearFilter();
            setCareby('');
            setSelectedDates(dayjs(today, 'YYYY/MM'));
            setQueryFilter({
              period: moment(today).format('MM-DD-YYYY'),
              staff_code: '',
            });
          }}
        >
          Reset bộ lọc
        </Button>
      </Space>
    </Space>
  );
};

export default BoxFilter;
