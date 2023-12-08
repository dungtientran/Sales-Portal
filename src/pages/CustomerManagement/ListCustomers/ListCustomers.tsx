/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DataType, TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Drawer, message, Table } from 'antd';
import { useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import BoxFilterListCustomer from '@/pages/components/box-filter/BoxFilterListCustomer';
import CreateUser from '@/pages/components/form/form-add-user';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

const { getListEmployee } = listEmployeeApi;

import { listEmployeeApi } from '@/api/ttd_list_employee';

import { Column } from './columns';

export type filterQueryType = {
  day_remaining: number | undefined;
  day_remaining_type: 'less' | 'max' | undefined;
  nav_low: number | undefined;
  nav_high: number | undefined;
  careby: string | undefined;
};

const { getListCustomer, createCustomer, addSaleCustomer, removeSaleCustomer } = listCustomerApi;

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
  const [queryFilter, setQuerFilter] = useState<filterQueryType>({
    careby: undefined,
    day_remaining: undefined,
    day_remaining_type: undefined,
    nav_high: undefined,
    nav_low: undefined,
  });
  const [originalData, setOriginalData] = useState([]);

  const [listCustomer, setListCustomer] = useState([]);
  const [listStaff, setListStaffr] = useState([]);

  const [customerSelect, setCustomerSelect] = useState<any>();

  const [total, setTotal] = useState<number>(0);

  const [dataExcel, setDataExcel] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListCustomer'],
    queryFn: () => getListCustomer(),
  });

  const listStaffRessponse = useQuery({
    queryKey: ['getListEmployee'],
    queryFn: () => getListEmployee(),
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
    // setQuerFilter({careby: ''});
    setListCustomer(originalData);
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      },
    });
  };

  const filterData = (queryFilter: filterQueryType) => {
    const { careby, day_remaining, day_remaining_type, nav_high, nav_low } = queryFilter;

    return originalData.filter((item: DataType) => {
      const navMatch =
        nav_low && nav_high ? Number(item.nav) >= Number(nav_low) && Number(item.nav) <= Number(nav_high) : true;

      const minDayMatch = day_remaining_type === 'less' && day_remaining ? item.day_remaining < day_remaining : true;
      const maxDayMatch = day_remaining_type === 'max' && day_remaining ? item.day_remaining > day_remaining : true;

      const carebyMatch = careby ? item.sale_name?.includes(careby) : true;

      return navMatch && minDayMatch && maxDayMatch && carebyMatch;
    });
  };

  const resultFilterData = (queryFilter: filterQueryType) => {
    const resultFilterData = filterData(queryFilter);

    setListCustomer(resultFilterData);
    setTotal(resultFilterData?.length);
  };

  useEffect(() => {
    if (data?.code === 200) {
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
          sale_name: item?.care_by?.fullname,
          subscription_product: item?.subscription?.subscription_product?.name,
        };

        return column;
      });

      setListCustomer(columns);
      setOriginalData(columns);
      setTotal(columns?.length);
      getExcelData(data?.data?.count as string);
      // setDataExcel();
    }
  }, [data]);
  useEffect(() => {
    if (listStaffRessponse?.data?.code === 200) {
      const listStaffCustom = listStaffRessponse?.data?.data?.rows?.map((item: any) => {
        return {
          value: item.fullname,
        };
      });

      setListStaffr(listStaffCustom);
    }
  }, [listStaffRessponse?.data?.code]);

  console.log('queryrrrrrrr', queryFilter);

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách khách hàng" />
      {/* <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <Button onClick={showDrawer} type="primary">
          <PlusOutlined /> Tạo mới người dùng
        </Button>
      </div> */}
      <BoxFilterListCustomer
        setQueryFiter={setQuerFilter}
        clearFilter={handleClearFilter}
        setTableParams={setTableParams}
        resultFilterData={resultFilterData}
        listStaff={listStaff}
      />
      <Result total={total} columns={Column()} dataSource={listCustomer} title="Danh sách khách hàng" />
      <div className="table_list_customer">
        <Table
          columns={Column()}
          rowKey={record => record.id}
          dataSource={listCustomer}
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
