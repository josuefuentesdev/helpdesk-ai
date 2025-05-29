"use client"

import { useMemo } from "react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import type { AssetGetAllItem } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { useTranslations } from "next-intl"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { AssetDataTableToolbar } from "@/components/asset-table/asset-data-table-toolbar"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { format } from "date-fns"
import { UserWithAvatar } from "../user-with-avatar"


export function AssetDataTable({
  data,
  className,
  initialColumnVisibility,
}: {
  data: AssetGetAllItem[],
  className?: string,
  initialColumnVisibility?: Partial<Record<keyof AssetGetAllItem, boolean>>
}) {
  const t = useTranslations('TicketDataTable');

  const columnHelper = createColumnHelper<AssetGetAllItem>()
  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('id')} />
      ),
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('type')} />
      ),
    }),
    columnHelper.accessor("subtype", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('subtype')} />
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name')} />
      ),
    }),
    columnHelper.accessor("serialNumber", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('serialNumber')} />
      ),
    }),
    columnHelper.accessor("purchaseAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('purchaseAt')} />
      ),
      cell: (purchaseAt) => {
        const dateValue = purchaseAt.getValue();
        return (
          <div>{dateValue ? format(dateValue, 'yyyy-MM-dd') : '-'}</div>
        );
      },
    }),
    columnHelper.accessor("warrantyExpiresAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('warrantyExpiresAt')} />
      ),
      cell: (warrantyExpiresAt) => {
        const dateValue = warrantyExpiresAt.getValue();
        return (
          <div>{dateValue ? format(dateValue, 'yyyy-MM-dd') : '-'}</div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('status')} />
      ),
    }),
    columnHelper.accessor("assignedToId", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('assignedTo')} />
      ),
      cell: (assignedToId) => {
        const userId = assignedToId.getValue();
        return (
          userId ? <UserWithAvatar userId={userId} /> : t('noAssigned')
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('createdAt')} />
      ),
      cell: (createdAt) => {
        const dateValue = createdAt.getValue();
        return (
          <div>{format(dateValue, 'PPpp')}</div>
        );
      },
    }),
    columnHelper.accessor("updatedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('updatedAt')} />
      ),
      cell: (updatedAt) => {
        const dateValue = updatedAt.getValue();
        return (
          <div>{format(dateValue, 'PPpp')}</div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link href={`/assets/${row.original.id}`}>
            <Icons.view className="h-4 w-4" />
          </Link>
          <Link href={`/assets/${row.original.id}/edit`}>
            <Icons.edit className="h-4 w-4" />
          </Link>
        </div>
      ),
      size: 50,
    }),
    // dirty fix as https://github.com/TanStack/table/issues/4302
  ] as ColumnDef<AssetGetAllItem, unknown>[],
  [columnHelper, t])

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