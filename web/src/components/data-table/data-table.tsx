"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
  type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState, type Table as TableType
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTablePagination } from "./data-table-pagination"
import { cn } from "@/lib/utils"
import { DataTableDownload } from "./data-table-download"
import { useTranslations } from "next-intl"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: (table: TableType<TData>) => React.ReactNode,
  className?: string,
  initialColumnVisibility?: Record<string, boolean>
  onRowDoubleClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  className,
  initialColumnVisibility = {},
  onRowDoubleClick,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations('DataTable');

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      columnPinning: {
        right: ['actions'],
      },
    },
  })

  return (
    <div className={cn("space-y-4 flex flex-col h-full min-h-0", className)}>
      <div className="flex items-center overflow-x-auto">
        {toolbar?.(table)}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <DataTableViewOptions table={table} />
          <DataTableDownload table={table} />
        </div>
      </div>
      <ScrollArea className="rounded-md border flex-1 min-h-0">
        <Table>
          <TableHeader className="z-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.getIsPinned() ?
                        "sticky right-0 z-0 bg-accent shadow-md" : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onDoubleClick={() => onRowDoubleClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.getIsPinned() ?
                        "sticky right-0 z-0 bg-background shadow-md" : ""
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} />
    </div>
  )
}
