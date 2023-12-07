import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;

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
      title: 'Mã nhân viên',
      dataIndex: 'staff_code',
      width: '8%',
      ...ColumnSearchProps('staff_code'),
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      width: '8%',
      ...ColumnSearchProps('fullname'),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      width: '15%',
      ...ColumnSearchProps('phone_number'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '14%',
      ...ColumnSearchProps('email'),
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      width: '14%',
      render: (_, record) => <Text>Sale</Text>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      width: '8%',
      filters: [
        { text: 'Trưởng phòng', value: 'Trưởng phòng' },
        { text: 'Giám đốc kinh doanh', value: 'Giám đốc kinh doanh' },
        { text: 'Giám đốc khối', value: 'Giám đốc khối' },
        { text: 'Giám đốc vùng', value: 'Giám đốc vùng' },
      ],
      onFilter(value, record) {
        return record.level.includes(value as string);
      },
    },
    // {
    //   title: '',
    //   dataIndex: 'action',
    //   width: '8%',
    //   render: (_, record) => (
    //     <Space size="small">
    //       <Button type="primary" size="small" onClick={() => {}}>
    //         <EditOutlined />
    //       </Button>
    //       <Popconfirm title="Chắc chắn xóa" onConfirm={() => {}}>
    //         <Button
    //           type="primary"
    //           size="small"
    //           // onClick={() => {
    //           //   setCustomerSelect(record);
    //           // }}
    //         >
    //           <DeleteOutlined />
    //         </Button>
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return columns;
};
