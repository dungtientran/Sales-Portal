import type { ColumnTyle, DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import './index.less';

import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { Fragment, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;

export const ColumnSearchPropss = (dataIndex: DataIndex): ColumnType<ColumnTyle> => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  };
};

export const Column = () => {
  const columns: ColumnsType<ColumnTyle> = [
    {
      title: 'Số hợp đồng',
      dataIndex: 'contract_no',
      width: '5%',
      ...ColumnSearchPropss('contract_no'),
    },
    {
      title: 'Mã KH',
      dataIndex: 'customer_code',
      width: '6%',
      ...ColumnSearchPropss('customer_code'),
    },
    {
      title: 'Tên KH',
      dataIndex: 'name',
      width: '8%',
      ...ColumnSearchPropss('name'),
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_number',
      ...ColumnSearchPropss('phone_number'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '6%',
      ...ColumnSearchPropss('email'),
    },
    {
      title: 'Mã nhân viên QL',
      dataIndex: 'staff_code',
      width: '8%',
    },
    {
      title: 'Tên nhân viên QL',
      dataIndex: 'name_sale',
      width: '10%',
      ...ColumnSearchPropss('name_sale'),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      width: '8%',
      sorter: (a, b) => (new Date(a.start_date) < new Date(b.start_date) ? -1 : 1),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      width: '8%',
      sorter: (a, b) => (new Date(a.end_date) < new Date(b.end_date) ? -1 : 1),
    },
    {
      title: 'Giá trị ban đầu',
      dataIndex: 'initial_value',
      width: '10%',
      render: (_, record) => <Text>{record?.initial_value?.toLocaleString()}</Text>,
      sorter: (a, b) => Number(a.initial_value) - Number(b.initial_value),
    },
    {
      title: 'Lợi nhuận % (dự kiến)',
      dataIndex: 'profit_percent',
      width: '8%',
      render: (_, record) => <Tag color={record?.profit_percent > 0 ? 'blue' : 'red'}>{record?.profit_percent}</Tag>,
      sorter: (a, b) => Number(a.profit_percent) - Number(b.profit_percent),
    },
    {
      title: 'Hoa hồng tạm tính (Fila)',
      dataIndex: 'commission',
      width: '16%',
      render: (_, record) => <Text>{record?.commission?.toLocaleString()}</Text>,
      sorter: (a, b) => Number(a.commission) - Number(b.commission),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      width: '5%',
      render: (_, record) => <Tag color="#108ee9">{record?.status}</Tag>,
    },
    {
      title: '',
      dataIndex: 'action',
      // width: '8%',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => {}}>
            <EditOutlined />
          </Button>
          <Button type="primary" size="small" onClick={() => {}}>
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return columns;
};
