import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography } from 'antd';
import moment from 'moment';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { addTag } from '@/stores/tags-view.store';

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

export const Column = () => {
  const { user } = useSelector(state => state.user);

  const levelSale = user?.SaleLevel?.level;

  const dispatch = useDispatch();

  const handelAddTag = (id: string, name: string) => {
    dispatch(
      addTag({
        code: 'con tro lơ',
        closable: true,
        label: {
          en_US: `${name}`,
          zh_CN: 'asdas',
        },
        path: `/commission-management/membership-commission/${id}`,
      }),
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Kỳ',
      dataIndex: 'period',
      width: '8%',
      render: (_, record) => <Text>{moment(record?.period).format('YYYY/MM')}</Text>,
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'staff_code',
      width: '8%',
      render: (_, record) => (
        <Link
          to={`/commission-management/membership-commission/${record?.staff_code}?period=${record?.period}`}
          onClick={() => handelAddTag(record?.staff_code, record?.staff_code)}
        >
          {record?.staff_code}
        </Link>
      ),
    },
    {
      title: 'Hoa hồng từ đăng ký',
      dataIndex: 'sub_commission',
      width: '15%',
      render: (_, record) => <Text>{record?.sub_commission?.toLocaleString()}</Text>,
    },
    {
      title: 'Hoa hồng hợp đồng',
      dataIndex: 'contract_commission',
      render: (_, record) => <Text>{record?.contract_commission?.toLocaleString()}</Text>,

      width: '14%',
    },
    {
      title: 'Hoa hồng cấp trưởng phòng',
      dataIndex: 'manager_commission',
      width: '14%',
      render: (_, record) => <Text>{record?.manager_commission?.toLocaleString()}</Text>,
    },

    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      width: '14%',
      render: (_, record) => <Text>{record?.total?.toLocaleString()}</Text>,
    },
  ];

  if (levelSale > 1) {
    columns.splice(5, 0, {
      title: 'Hoa hồng cấp giám đốc',
      dataIndex: 'director_commission',
      width: '14%',
      render: (_, record) => <Text>{record?.director_commission?.toLocaleString()}</Text>,
    });
  }

  return columns;
};
