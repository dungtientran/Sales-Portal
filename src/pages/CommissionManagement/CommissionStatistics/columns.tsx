import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag, Typography } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;

export const Column = (type?: 'saleManager' | 'manager') => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Ngày phát sinh',
      dataIndex: 'date',
      width: '8%',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      width: '8%',
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'customer_code',
      width: '15%',
    },
    {
      title: 'Doanh số/LN',
      dataIndex: 'amount',
      width: '14%',
      render: (_, record) => <Text>{Number(record?.amount).toLocaleString()}</Text>,
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'commission',
      width: '14%',
      render: (_, record) => <Text>{Number(record?.commission).toLocaleString()}</Text>,
    },
  ];

  if (type === 'saleManager') {
    columns.splice(2, 0, {
      title: 'Nhân viên',
      dataIndex: 'staff_code',
      width: '14%',
    });
  }

  if (type === 'manager') {
    columns.splice(2, 0, {
      title: 'Trưởng phòng',
      dataIndex: 'staff_code',
      width: '14%',
    });
  }

  return columns;
};
