import type { DataType } from '../CommissionStatistics/index.interface';

import { Button } from 'antd';
import ExcelJS from 'exceljs';

interface ExportExcelButtonProps {
  dataSource1: DataType[];
  dataSource2: DataType[];
  dataSource3: DataType[];
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({ dataSource1, dataSource2, dataSource3 }) => {
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    const sheet1 = workbook.addWorksheet('Hoa hồng cá nhân');
    const sheet2 = workbook.addWorksheet('Hoa hồng trưởng phòng');
    const sheet3 = workbook.addWorksheet('Hoa hồng giám đốc');

    sheet1.addRows(dataSource1);
    sheet2.addRows(dataSource2);
    sheet3.addRows(dataSource3);

    // const buffer = await workbook.xlsx.writeBuffer();

    // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement('a');

    // link.href = url;
    // link.download = 'exportedData.xlsx';
    // link.click();
  };

  return (
    <Button onClick={handleExportExcel} type="primary">
      Export to Excel
    </Button>
  );
};

export default ExportExcelButton;
