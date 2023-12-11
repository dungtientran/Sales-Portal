import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;

export const ColumnSearchProps = (
  dataIndex: DataIndex,
  listCustomerSp: DataType[],
  setTotal: (total: number) => void,
): ColumnType<DataType> => {
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

    if (selectedKeys[0]) {
      const filtered = listCustomerSp.filter(record =>
        record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase()) : '',
      );

      setTotal(filtered.length);
    } else {
      setTotal(listCustomerSp.length);
    }
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

export const Column = (
  listCustomerSp: DataType[],
  setTotal: (total: number) => void,
  type?: 'saleManager' | 'manager',
) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Ngày phát sinh',
      dataIndex: 'staff_code',
      width: '8%',
    },
    {
      title: 'Nội dung',
      dataIndex: 'fullname',
      width: '8%',
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'phone_number',
      width: '15%',
    },
    {
      title: 'Doanh số/LN',
      dataIndex: 'email',
      width: '14%',
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'role',
      width: '14%',
      render: () => <Text>Sale</Text>,
    },
  ];

  if (type === 'saleManager') {
    columns.splice(2, 0, {
      title: 'Nhân viên',
      dataIndex: 'role',
      width: '14%',
      render: () => <Text>nhân viên</Text>,
    });
  }

  if (type === 'manager') {
    columns.splice(2, 0, {
      title: 'Trưởng phòng',
      dataIndex: 'role',
      width: '14%',
      render: () => <Text>nhân viên</Text>,
    });
  }

  return columns;
};
