/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnTyle, DataType } from './index.interface';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import { format, isWithinInterval, parse } from 'date-fns';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { listContractApi } from '@/api/ttd_contract';
import { listCustomerApi } from '@/api/ttd_list_customer';
import MyModal from '@/components/basic/modal';
import CreateContract from '@/pages/components/form/form-contract';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';
import DetailsContract from './DetailsContract';

const { getSaleList, getListUser } = listCustomerApi;

const { getListContract, createContract, updateContract } = listContractApi;

export type filterQueryType = {
  start_date: string;
  end_date: string;
  initial_value_from: string;
  initial_value_to: string;
  profit_percent_from: string;
  profit_percent_to: string;
  fila_commission_from: string;
  fila_commission_to: string;
};

const BlockContract: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModel] = useState(false);

  const [listContract, setListContract] = useState([]);
  const [newContract, setNewContract] = useState<any>();
  const [originalData, setOriginalData] = useState([]);

  const [dataExcel, setDataExcel] = useState([]);

  const [queryFilter, setQueryFilter] = useState<filterQueryType>({
    start_date: '',
    end_date: '',
    initial_value_from: '',
    initial_value_to: '',
    profit_percent_from: '',
    profit_percent_to: '',
    fila_commission_from: '',
    fila_commission_to: '',
  });
  const [updateDataSp, setUpdateDataSp] = useState<any>();
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');
  const [contractExists, setContractExists] = useState(false);

  const [total, setTotal] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListContractDone'],
    queryFn: () => getListContract('done'),
  });

  const update = useMutation({
    mutationFn: _ => updateContract(updateDataSp?.contract_no as string, updateDataSp),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListContractDone']);
      message.success('Update thành công');
      setUpdateDataSp(undefined);
      setOpen(false);
    },
    onError: _ => {
      message.error('Update thất bại');
    },
  });
  const create = useMutation({
    mutationFn: _ => createContract(newContract),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListContractDone']);
      message.success('Tạo hợp đồng thành công');
      setNewContract(undefined);
      setOpen(false);
      setContractExists(false);
    },
    onError: (err: any) => {
      message.error(`${err?.message}` || 'Tạo hợp đồng thất bại');
      setContractExists(true);
    },
  });
  const saleData = useQuery({
    queryKey: ['getSaleList'],
    // queryFn: () => getSaleList(),
  });

  const userData = useQuery({
    queryKey: ['getListUser'],
    // queryFn: () => getListUser(''),
  });

  const onClose = () => {
    setOpen(false);
  };

  const handelResetFilter = () => {
    // setQueryFilter('');
    setListContract(originalData);
  };

  const handleSetPageOnFilter = () => {};

  useEffect(() => {
    if (data) {
      const columndata = data?.data?.rows.map((item: DataType) => {
        return {
          id: item?.id,
          contract_no: item?.contract_no,
          customer_code: item?.customer?.customer_code,
          name: item?.customer?.fullname,
          phone_number: item?.customer?.phone_number,
          email: item?.customer?.email,
          staff_code: item?.sale?.staff_code,
          name_sale: item?.sale?.fullname,
          start_date: moment(item?.start_date).format('DD/MM/YYYY'),
          end_date: moment(item?.end_date).format('DD/MM/YYYY'),
          initial_value: item?.initial_value,
          expected_end_value: item?.expected_end_value,
          commission: item?.contract_commission?.fila_commission,
          status: item?.status === 'pending' ? 'Đang có hiệu lực' : 'Đã thanh lý',
          profit_percent: item?.profit_percent,
          total_commission:
            item?.contract_commission?.director_commission +
            item?.contract_commission?.fila_commission +
            item?.contract_commission?.manager_commission +
            item?.contract_commission?.sales_commission,
        };
      });

      // getListDataExcel(data?.data?.count);

      setListContract(columndata);
      setOriginalData(columndata);
      setTotal(data?.data?.count);
    }
  }, [data]);

  useEffect(() => {
    if (updateDataSp) {
      update.mutate();
    }
  }, [updateDataSp]);

  useEffect(() => {
    if (newContract) {
      create.mutate();
    }
  }, [newContract]);

  useEffect(() => {
    if (isLoading) setDataExcel([]);
  }, [isLoading]);

  const filterData = (queryFilter: filterQueryType) => {
    const {
      end_date,
      fila_commission_from,
      fila_commission_to,
      initial_value_from,
      initial_value_to,
      profit_percent_from,
      profit_percent_to,
      start_date,
    } = queryFilter;
    const startDateObj = parse(start_date, 'dd/MM/yyyy', new Date());
    const endDateObj = parse(end_date, 'dd/MM/yyyy', new Date());

    return originalData.filter((item: ColumnTyle) => {
      const itemStartDate = parse(item.start_date, 'dd/MM/yyyy', new Date());
      const itemEndDate = parse(item.end_date, 'dd/MM/yyyy', new Date());

      const dateMath =
        start_date && end_date
          ? isWithinInterval(itemStartDate, { start: startDateObj, end: endDateObj }) ||
            isWithinInterval(itemEndDate, { start: startDateObj, end: endDateObj }) ||
            (itemStartDate >= startDateObj && itemEndDate <= endDateObj)
          : true;

      const initValueMatch =
        initial_value_to && initial_value_from
          ? Number(item.initial_value) >= Number(initial_value_from) &&
            Number(item.initial_value) <= Number(initial_value_to)
          : true;

      const profitPercentMatch =
        profit_percent_to && profit_percent_from
          ? Number(item.profit_percent) >= Number(profit_percent_from) &&
            Number(item.profit_percent) <= Number(profit_percent_to)
          : true;

      return initValueMatch && profitPercentMatch && dateMath;
    });
  };

  const resultFilterData = (queryFilter: filterQueryType) => {
    const resultFilterData = filterData(queryFilter);

    setListContract(resultFilterData);
    setTotal(resultFilterData?.length);
  };

  return (
    <div className="aaa">
      <HeadTitle title="Hợp đồng đã thanh lý" />
      {/* <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <Button
          onClick={() => {
            setOpen(true);
            // setNewContract(undefined);
            setCustomerSelect(undefined);
          }}
          type="primary"
        >
          <PlusOutlined /> Thêm hợp đồng
        </Button>
      </div> */}
      <BoxFilter
        setQueryFilter={setQueryFilter}
        handelResetFilter={handelResetFilter}
        handleSetPageOnFilter={handleSetPageOnFilter}
        resultFilterData={resultFilterData}
      />
      <Result
        total={total}
        columns={Column()}
        dataSource={listContract}
        title="Danh sách hợp đồng Vip (còn hiệu lực)"
        totalCommission={data?.total}
      />
      <div className="table_contract">
        <Table
          columns={Column()}
          rowKey={record => record.id}
          dataSource={listContract}
          loading={isLoading}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>

      <MyModal
        // title="Chi tiết hợp đồng"
        centered
        open={openModal}
        onCancel={() => setOpenModel(false)}
        className="modal_contract"
        width={1000}
      >
        <DetailsContract details={customerSelect} />
      </MyModal>
    </div>
  );
};

export default BlockContract;
