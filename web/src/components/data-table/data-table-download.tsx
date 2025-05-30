import type { Table } from "@tanstack/react-table"
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface DataTableDownloadProps<TData> {
  table: Table<TData>
}

// Define the accepted data types for the CSV export
type AcceptedDataValue = string | number | boolean | null | undefined;

export function DataTableDownload<TData>({ table }: DataTableDownloadProps<TData>) {
  const handleDownload = () => {
    // Get only the visible rows and columns
    const visibleColumns = table.getVisibleFlatColumns();
    const visibleRows = table.getFilteredRowModel().rows;
    
    // Create data rows from visible cells
    const csvData = visibleRows.map(row => {
      const rowData: Record<string, AcceptedDataValue> = {};
      
      visibleColumns.forEach(column => {
        // Get the cell value for this column in this row
        const cell = row.getVisibleCells().find(cell => cell.column.id === column.id);
        let value = cell?.getValue();
        
        // Ensure the value is an accepted type for CSV export
        if (value !== null && value !== undefined && typeof value !== 'string' && 
            typeof value !== 'number' && typeof value !== 'boolean') {
          // Convert complex objects to string representation
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          value = String(value);
        }
        
        // Use the column header or ID as the key
        const key = (typeof column.columnDef.header === 'string')
          ? column.columnDef.header
          : column.id;
          
        rowData[key] = value as AcceptedDataValue;
      });
      
      return rowData;
    });
    
    // Configure the CSV export
    const csvConfig = mkConfig({
      filename: `table-export-${new Date().toISOString().split('T')[0]}`,
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
    });
    
    // Generate and download the CSV
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
      Export
    </Button>
  )
}