"use client"

import { useMemo } from "react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import type { UserGetAllItem } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { useTranslations } from "next-intl"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { UserDataTableToolbar } from "./user-data-table-toolbar"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { UserWithAvatar } from "../user-with-avatar"
import { useRouter } from "next/navigation"
import { useFormatter } from "next-intl"

export function UserDataTable({
  data,
  className,
  initialColumnVisibility,
}: {
  data: UserGetAllItem[],
  className?: string,
  initialColumnVisibility?: Partial<Record<keyof UserGetAllItem, boolean>>
}) {
  const t = useTranslations('UserDataTable');
  const formatter = useFormatter()

  const router = useRouter();

  const columnHelper = createColumnHelper<UserGetAllItem>()
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
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('name')} />
      ),
      cell: (name) => {
        const nameValue = name.getValue();
        return (
          <div className="font-medium">{nameValue}</div>
        );
      },
      meta: {
        title: t('name'),
        csv: true
      }
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('email')} />
      ),
      meta: {
        title: t('email'),
        csv: true
      }
    }),
    columnHelper.accessor("image", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('avatar')} />
      ),
      cell: (row) => {
        const userId = row.row.original.id;
        return (
          <UserWithAvatar userId={userId} />
        );
      },
      meta: {
        title: t('avatar'),
        csv: false
      }
    }),
    columnHelper.accessor(row => row.department?.name, {
      id: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('department')} />
      ),
      meta: {
        title: t('department'),
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
          <Link href={`/users/${row.original.id}`}>
            <Icons.view className="h-4 w-4" />
          </Link>
          <Link href={`/users/${row.original.id}/edit`}>
            <Icons.edit className="h-4 w-4" />
          </Link>
        </div>
      ),
      enableResizing: false,
    }),
    // dirty fix as https://github.com/TanStack/table/issues/4302
  ] as ColumnDef<UserGetAllItem, unknown>[],
  [columnHelper, t])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => <UserDataTableToolbar table={table} />}
      className={className}
      initialColumnVisibility={initialColumnVisibility}
      onRowDoubleClick={(row) => router.push(`/users/${row.id}`)}
    />
  )
}