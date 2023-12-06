import type { DataIndex, DataType } from './index.interface';
import type { UseMutationResult } from '@tanstack/react-query';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Popconfirm, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

import user from '@/assets/logo/user.png';

const { Text, Link } = Typography;

export const ColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => {
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
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã',
      dataIndex: 'customer_code',
      // sorter: true,
      width: '14%',
      ...ColumnSearchProps('customer_code'),
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar_url',
      width: '8%',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={record.avatar_url ? record.avatar_url : user} size="default" />
        </div>
      ),
    },
    {
      title: 'Tên khách hàng',
      // sorter: true,
      dataIndex: 'fullname',
      width: '10%',
      ...ColumnSearchProps('fullname'),
    },
    {
      title: 'Số điện thoại',
      // sorter: true,
      dataIndex: 'phone_number',
      width: '14%',
      ...ColumnSearchProps('phone_number'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '18%',
      ...ColumnSearchProps('email'),
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscription_product',
      width: '8%',
      // filters: [
      //   { text: 'Trial', value: 'trial' },
      //   { text: 'Vip', value: 'vip' },
      //   { text: 'Premium', value: 'premium' },
      // ],
      // render: (_, record) => <Text>{record.subscription?.subscription_product?.name}</Text>,
    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      width: '8%',
      sorter: (a, b) => Number(a.nav) - Number(b.nav),
      render: (_, record) => <Text>{record?.nav ? record?.nav?.toLocaleString() : 0}</Text>,
    },
    {
      title: 'Số ngày còn lại',
      dataIndex: 'day_remaining',
      width: '8%',
      sorter: (a, b) => Number(a.day_remaining) - Number(b.day_remaining),
    },
    {
      title: 'Nhân viên chăm, sóc',
      dataIndex: 'sale_name',
      width: '15%',
      ...ColumnSearchProps('sale_name'),

      render: (_, record) => (
        <Space size="middle">
          {record.sale_name ? (
            <Space direction="vertical">
              <Text strong>{record.sale_name}</Text>
              <Popconfirm title="Chắc chắn" onConfirm={() => {}}>
                <Link>Xóa</Link>
              </Popconfirm>
            </Space>
          ) : (
            <Button type="primary" size="middle" onClick={() => {}}>
              <UserAddOutlined />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return columns;
};
