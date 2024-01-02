import { Space, Typography } from 'antd';

import ExportExcel from '../button-export-excel/ExportExcel';

const { Text } = Typography;

interface IResult {
  searchText?: string;
  total?: number;
  columns?: any;
  dataSource?: any;
  isButtonExcel?: boolean;
  title?: string;
  totalCommission?: number;
  totalDirector?: number;
  totalManager?: number;
  totalSale?: number;
}

const Result: React.FC<IResult> = ({
  searchText,
  total,
  columns,
  dataSource,
  isButtonExcel = true,
  title,
  totalCommission,
  totalDirector,
  totalManager,
  totalSale,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
      <div style={{ height: '22px' }}>
        {total ? (
          <Text>
            Có tất cả <Text strong>{total?.toLocaleString()}</Text> kết quả
            {searchText && (
              <Typography.Text>
                {' '}
                tìm kiếm cho <Text strong>{searchText}</Text>
              </Typography.Text>
            )}
          </Text>
        ) : (
          ''
        )}
      </div>
      {isButtonExcel && (
        <div>
          <Space size="small">
            {totalCommission && (
              <Text style={{ marginRight: '30px' }}>
                Tổng hoa hồng: <Text strong>{totalCommission?.toLocaleString()}</Text>
              </Text>
            )}
            {totalDirector && (
              <Text style={{ marginRight: '30px' }}>
                Tổng hoa hồng giám đốc: <Text strong>{totalDirector?.toLocaleString()}</Text>
              </Text>
            )}
            {totalManager && (
              <Text style={{ marginRight: '30px' }}>
                Tổng hoa hồng trưởng phòng: <Text strong>{totalManager?.toLocaleString()}</Text>
              </Text>
            )}
            {totalSale && (
              <Text style={{ marginRight: '30px' }}>
                Tổng hoa hồng sale: <Text strong>{totalSale?.toLocaleString()}</Text>
              </Text>
            )}
          </Space>

          <ExportExcel columns={columns} dataSource={dataSource} title={title} />
        </div>
      )}
    </div>
  );
};

export default Result;
