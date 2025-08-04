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
import { UserWithAvatar } from "../user-with-avatar"
import { AssetStatusBadge } from "@/components/asset-table/asset-status-badge"
import { AssetTypeBadge } from "@/components/asset-table/asset-type-badge"
import { useRouter } from "next/navigation"
import { useFormatter } from "next-intl"
import Image from 'next/image'

export function AssetDataTable({
  data,
  className,
  initialColumnVisibility,
}: {
  data: AssetGetAllItem[],
  className?: string,
  initialColumnVisibility?: Partial<Record<keyof AssetGetAllItem, boolean>>
}) {
  const t = useTranslations('AssetDataTable');
  const formatter = useFormatter()

  const router = useRouter();

  const columnHelper = createColumnHelper<AssetGetAllItem>()
  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('id')} />
      ),
      meta: {
        title: t('id'),
        csv: true
      }
    }),
    columnHelper.accessor("image", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('image')} />
      ),
      cell: (image) => {
        const imageValue = image.getValue();
        return imageValue ? (
          <div className="flex items-center">
            <Image
              src={imageValue}
              alt="Asset"
              className="h-8 w-8 rounded object-cover"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-8 w-8 rounded bg-muted">
            <Icons.imageIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        );
      },
      meta: {
        title: t('image'),
        csv: false
      }
    }),
    columnHelper.accessor("type", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('type')} />
      ),
      cell: (type) => {
        const typeValue = type.getValue();
        return <AssetTypeBadge type={typeValue} />;
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue<string>(id))
      },
      meta: {
        title: t('type'),
        csv: true
      }
    }),
    columnHelper.accessor("subtype", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('subtype')} />
      ),
      meta: {
        title: t('subtype'),
        csv: true
      }
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name')} />
      ),
      meta: {
        title: t('name'),
        csv: true
      }
    }),
    columnHelper.accessor("serialNumber", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('serialNumber')} />
      ),
      meta: {
        title: t('serialNumber'),
        csv: true
      }
    }),
    columnHelper.accessor("purchaseAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('purchaseAt')} />
      ),
      cell: (purchaseAt) => {
        const dateValue = purchaseAt.getValue();
        return (
          <div>{dateValue ? formatter.dateTime(dateValue) : '-'}</div>
        );
      },
      meta: {
        title: t('purchaseAt'),
        csv: true
      }
    }),
    columnHelper.accessor("warrantyExpiresAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('warrantyExpiresAt')} />
      ),
      cell: (warrantyExpiresAt) => {
        const dateValue = warrantyExpiresAt.getValue();
        return (
          <div>{dateValue ? formatter.dateTime(dateValue) : '-'}</div>
        );
      },
      meta: {
        title: t('warrantyExpiresAt'),
        csv: true
      }
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('status')} />
      ),
      cell: (status) => {
        const statusValue = status.getValue();
        return <AssetStatusBadge status={statusValue} />;
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue<string>(id))
      },
      meta: {
        title: t('status'),
        csv: true
      }
    }),
    columnHelper.accessor(row => row.assignedTo?.department?.name, {
      id: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('department')} />
      ),
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue<string>(id))
      },
      meta: {
        title: t('department'),
        csv: true
      }
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
      meta: {
        title: t('assignedTo'),
        csv: true
      }
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('createdAt')} />
      ),
      cell: (createdAt) => {
        const dateValue = createdAt.getValue();
        return (
          <div>{formatter.dateTime(dateValue, 'fullShort')}</div>
        );
      },
      meta: {
        title: t('createdAt'),
        csv: true
      }
    }),
    columnHelper.accessor("createdById", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('createdBy')} />
      ),
      cell: (createdById) => {
        const userId = createdById.getValue();
        return (
          <UserWithAvatar userId={userId} />
        );
      },
      meta: {
        title: t('createdBy'),
        csv: true
      }
    }),
    columnHelper.accessor("updatedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('updatedAt')} />
      ),
      cell: (updatedAt) => {
        const dateValue = updatedAt.getValue();
        return (
          <div>{formatter.dateTime(dateValue, 'fullShort')}</div>
        );
      },
      meta: {
        title: t('updatedAt'),
        csv: true
      }
    }),
    columnHelper.accessor("updatedById", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('updatedBy')} />
      ),
      cell: (updatedById) => {
        const userId = updatedById.getValue();
        return (
          userId ? <UserWithAvatar userId={userId} /> : t('neverUpdated')
        );
      },
      meta: {
        title: t('updatedBy'),
        csv: true
      }
    }),
    columnHelper.display({
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={""} />
      ),
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
      enableResizing: false,
    }),
    // dirty fix as https://github.com/TanStack/table/issues/4302
  ] as ColumnDef<AssetGetAllItem, unknown>[],
    [columnHelper, formatter, t])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => <AssetDataTableToolbar table={table} />}
      className={className}
      initialColumnVisibility={initialColumnVisibility}
      onRowDoubleClick={(row) => router.push(`/assets/${row.id}`)}
    />
  )
}