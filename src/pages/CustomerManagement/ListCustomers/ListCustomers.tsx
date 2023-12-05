/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DataIndex, DataType, TableParams } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType, FilterConfirmProps } from 'antd/es/table/interface';

import './index.less';

import { PlusOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Drawer, Input, message, notification, Popconfirm, Space, Table, Typography } from 'antd';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { listCustomerApi } from '@/api/ttd_list_customer';
import user from '@/assets/logo/user.png';
import BoxFilterListCustomer from '@/pages/components/box-filter/BoxFilterListCustomer';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';
import CreateUser from '@/pages/components/form/form-add-user';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { Text, Link } = Typography;

const { getListCustomer, createCustomer, addSaleCustomer, removeSaleCustomer } = listCustomerApi;

// interface DataType {
//   id: string;
//   avatar_url: string;
//   fullname: string;
//   email: string;
//   customer_code: string;
//   phone_number: string;
//   subscription_product: string;
//   nav: number | null;
//   sale_name: string | undefined;
//   day_remaining: number;
// }

// type DataIndex = keyof DataType;

const ListCustomers: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50'],
    },
  });
  const [queryFilter, setQuerFilter] = useState('');
  const [listCustomer, setListCustomer] = useState([]);

  const [customerSelect, setCustomerSelect] = useState<any>();

  const [dataExcel, setDataExcel] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListCustomer'],
    queryFn: () => getListCustomer(),
  });

  const getExcelData = async (limit: string) => {
    try {
      const res = await getListCustomer();

      if (res?.code === 200) {
        const columnsExcel = res?.data?.rows?.map((item: any) => {
          const column = {
            avatar_url: item?.avatar_url,
            customer_code: item?.customer_code,
            email: item?.email,
            nav: item?.CaculatorHistories?.expected_amount,
            fullname: item?.fullname,
            id: item?.id,
            phone_number: item?.phone_number,
            day_remaining: item?.remaining_subscription_day,
            sale_name: item?.careby?.sale?.fullname,
            subscription_product: item?.subscription?.subscription_product?.name,
          };

          return column;
        });

        // console.log('columns__________________', columns);

        setDataExcel(columnsExcel);
      } else {
        message.warning('Lỗi khi xuất dữ liệu');
      }
    } catch (error) {
      console.log(error);
      message.error('Lỗi server');
    }
  };

  const useCustomer = () => {
    const create = useMutation(createCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Tạo người dùng mới thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Tạo mới thất bại');
      },
    });
    const update = useMutation(addSaleCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Thêm nhân viên hỗ trợ thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Thêm nhân viên hỗ trợ thất bại');
      },
    });
    const deleteSale = useMutation(removeSaleCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Xóa nhân viên hỗ trợ thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Xóa nhân viên hỗ trợ thất bại');
      },
    });

    return { create, update, deleteSale };
  };

  const showDrawer = () => {
    setCustomerSelect(undefined);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleClearFilter = () => {
    setQuerFilter('');
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      },
    });
  };

  useEffect(() => {
    if (data) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data?.data?.count,
        },
      });
      const columns = data?.data?.rows?.map((item: any) => {
        const column = {
          avatar_url: item?.avatar_url,
          customer_code: item?.customer_code,
          email: item?.email,
          nav: item?.nav,
          fullname: item?.fullname,
          id: item?.id,
          phone_number: item?.phone_number,
          day_remaining: item?.remaining_subscription_day || 0,
          sale_name: item?.careby?.sale?.fullname,
          subscription_product: item?.subscription?.subscription_product?.name,
        };

        return column;
      });

      for (let i = 0; i < 100; i++) {
        columns.push({
          avatar_url:
            'https://merriam-webster.com/assets/mw/images/gallery/gal-wap-slideshow-slide/image2111165829-4503-95527072b83af590b6fe9c388e7e06c2@1x.jpg',
          customer_code: `000${i}`,
          day_remaining: `${i}`,
          email: `mailfake${i}@gmail.com`,
          fullname: `fake ${i}`,
          id: `${i}`,
          nav: `32${i}`,
          phone_number: `0123456${i}`,
          sale_name: `name fake ${i}`,
          subscription_product: '',
        });
      }
      // const columnsExcel = excelData.data?.data?.rows?.map((item: DataType) => {
      //   const column: ColumnListCustomerType = {
      //     avatar_url: item?.avatar_url,
      //     customer_code: item?.customer_code,
      //     email: item?.email,
      //     nav: item?.CaculatorHistories?.expected_amount,
      //     fullname: item?.fullname,
      //     id: item?.id,
      //     phone_number: item?.phone_number,
      //     day_remaining: item?.remaining_subscription_day,
      //     sale_name: item?.careby?.sale?.fullname,
      //     subscription_product: item?.subscription?.subscription_product?.name,
      //   };

      //   return column;
      // });
      // console.log('columns__________________', columns);

      // setDataExcel(columnsExcel);
      setListCustomer(columns);
      getExcelData(data?.data?.count as string);
      // setDataExcel();
    }
  }, [data]);

  useEffect(() => {
    if (isLoading) setDataExcel([]);
  }, [isLoading]);

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách khách hàng" />
      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <Button onClick={showDrawer} type="primary">
          <PlusOutlined /> Tạo mới người dùng
        </Button>
      </div>
      <BoxFilterListCustomer
        setQueryFiter={setQuerFilter}
        clearFilter={handleClearFilter}
        setTableParams={setTableParams}
      />
      <Result total={data?.data?.count} columns={Column()} dataSource={dataExcel} title="Danh sách khách hàng" />
      <div className="table_list_customer">
        <Table
          columns={Column()}
          rowKey={record => record.id}
          dataSource={listCustomer}
          // pagination={tableParams.pagination}
          // loading={isLoading}
          // onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
        />
      </div>
      <Drawer
        title={!customerSelect ? 'Tạo mới người dùng' : 'Thêm nhân viên hỗ trợ'}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateUser initForm={customerSelect} useCustomer={useCustomer} />
      </Drawer>
    </div>
  );
};

export default ListCustomers;
