"use client"

import type { Table } from "@tanstack/react-table"
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useFormatter, useTranslations } from "next-intl";

interface DataTableDownloadProps<TData> {
  table: Table<TData>
}

type AcceptedDataValue = string | number | boolean | null | undefined;

export function DataTableDownload<TData>({ table }: DataTableDownloadProps<TData>) {
  const t = useTranslations('DataTableDownload');
  const formatter = useFormatter()

  const handleDownload = () => {
    const visibleColumns = table.getVisibleFlatColumns();
    const allRows = table.getCoreRowModel().rows;
    
    const csvColumns = visibleColumns
      .filter(column => column.columnDef.meta?.csv);
    
    const csvData = allRows.map(row => {
      const rowData: Record<string, AcceptedDataValue> = {};
      
      csvColumns.forEach(column => {
        const cell = row.getVisibleCells().find(cell => cell.column.id === column.id);
        let value = cell?.getValue();
        
        if (value !== null && value !== undefined) {
          if (value instanceof Date) {
            value = formatter.dateTime(value, 'excel');
          } else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            value = String(value);
          }
        }
        
        const meta = column.columnDef.meta;
        const key = meta?.title ?? 
          (typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id);
          
        rowData[key] = value as AcceptedDataValue;
      });
      
      return rowData;
    });
    
    const csvConfig = mkConfig({
      filename: `table-export-${new Date().toISOString().split('T')[0]}`,
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
    });
    
    const csv = generateCsv(csvConfig)(csvData);
    download(csvConfig)(csv);
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className="h-8 px-2 lg:px-3"
    >
      <Icons.download className="mr-2 h-4 w-4" />
      {t('export')}
    </Button>
  )
}