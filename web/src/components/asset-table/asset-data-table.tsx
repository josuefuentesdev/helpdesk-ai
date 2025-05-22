"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { AssetGetAllItem } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { useTranslations } from "next-intl"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { AssetDataTableToolbar } from "@/components/asset-table/asset-data-table-toolbar"
import Link from "next/link"
import { Icons } from "../icons"


export function AssetDataTable({
  data,
  className,
  initialColumnVisibility,
}: {
  data: AssetGetAllItem[],
  className?: string,
  initialColumnVisibility?: Partial<Record<keyof AssetGetAllItem, boolean>>
}) {
  const intl = useTranslations('TicketDataTable');
  const columns: ColumnDef<AssetGetAllItem>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('id')} />
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('type')} />
      ),
    },
    {
      accessorKey: "subtype",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('subtype')} />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('name')} />
      ),
    },
    {
      accessorKey: "serialNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('serialNumber')} />
      ),
    },
    {
      accessorKey: "purchaseDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('purchaseDate')} />
      ),
    },
    {
      accessorKey: "purchasePrice",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('purchasePrice')} />
      ),
    },
    {
      accessorKey: "currency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('currency')} />
      ),
    },
    {
      accessorKey: "warrantyExpires",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('warrantyExpires')} />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('status')} />
      ),
    },
    {
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('assignedTo')} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('createdAt')} />
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('updatedAt')} />
      ),
    },
    {
      accessorKey: "deletedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={intl('deletedAt')} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) =>
        <div className="flex items-center space-x-2">
          <Link
            href={`/assets/${row.original.id}`}
          >
            <Icons.view className="h-4 w-4" />
          </Link>
          <Link
            href={`/assets/${row.original.id}/edit`}
          >
            <Icons.edit className="h-4 w-4" />
          </Link>
        </div>,
      size: 50,
    },
  ], [intl])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => <AssetDataTableToolbar table={table} />}
      className={className}
      initialColumnVisibility={initialColumnVisibility}
    />
  )
}