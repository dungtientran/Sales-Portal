import type { DataType } from '../CommissionStatistics/index.interface';
import type { ColumnsType } from 'antd/es/table';

import { Button } from 'antd';
import ExcelJS from 'exceljs';

interface ExportExcelButtonProps {
  dataSource1: DataType[];
  dataSource2: DataType[];
  dataSource3: DataType[];
  columns1: any;
  columns2: any;
  columns3: any;
  title: string;
  disable: boolean;
  saleLevel: number;
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
  dataSource1,
  dataSource2,
  dataSource3,
  columns1,
  columns2,
  columns3,
  title,
  disable,
  saleLevel,
}) => {
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet1 = workbook.addWorksheet('Hoa hồng cá nhân');
    const sheet2 = workbook.addWorksheet('Hoa hồng trưởng phòng');
    const sheet3 = workbook.addWorksheet('Hoa hồng giám đốc');

    sheet1.addRows(dataSource1);
    sheet2.addRows(dataSource2);
    sheet3.addRows(dataSource3);

    sheet1.columns = columns1.map((col: any) => ({ header: col.title, key: col.dataIndex }));
    sheet2.columns = columns2.map((col: any) => ({ header: col.title, key: col.dataIndex }));
    sheet3.columns = columns3.map((col: any) => ({ header: col.title, key: col.dataIndex }));

    dataSource1.forEach((record: any) => {
      const row = columns1.map((col: any) => {
        return record[col.dataIndex];
      });

      sheet1.addRow(row);
    });

    dataSource2.forEach((record: any) => {
      const row = columns2.map((col: any) => {
        return record[col.dataIndex];
      });

      sheet2.addRow(row);
    });

    if (saleLevel > 1) {
      dataSource3.forEach((record: any) => {
        const row = columns3.map((col: any) => {
          return record[col.dataIndex];
        });

        sheet3.addRow(row);
      });
    }

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = `${title}`;
      a.click();

      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button disabled={disable} onClick={handleExportExcel} type="primary">
      Export to Excel
    </Button>
  );
};

export default ExportExcelButton;
