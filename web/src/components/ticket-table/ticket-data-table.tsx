"use client"

import { useMemo } from "react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import type { TicketGetAllItem } from "@/types"
import { DataTable } from "@/components/data-table/data-table"
import { useTranslations } from "next-intl"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { UserWithAvatar } from "../user-with-avatar"
import { useRouter } from "next/navigation"
import { useFormatter } from "next-intl"
import { TicketDataTableToolbar } from "./ticket-data-table-toolbar"
import { TicketStatusBadge } from "./ticket-status-badge"
import { TicketPriorityBadge } from "./ticket-priority-badge"
import { Checkbox } from "@/components/ui/checkbox"

export function TicketDataTable({
  data,
  className,
  initialColumnVisibility,
}: {
  data: TicketGetAllItem[],
  className?: string,
  initialColumnVisibility?: Partial<Record<keyof TicketGetAllItem, boolean>>
}) {
  const t = useTranslations('TicketDataTable');
  const formatter = useFormatter()

  const router = useRouter();

  const columnHelper = createColumnHelper<TicketGetAllItem>()
  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('id')} />
      ),
      meta: {
        title: t('id'),
        csv: true
      }
    }),
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('title')} />
      ),
      cell: ({ getValue }) => (
        <div className="max-w-[300px] truncate" title={getValue() ?? undefined}>
          {getValue()}
        </div>
      ),
      meta: {
        title: t('title'),
        csv: true
      }
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('description')} />
      ),
      cell: ({ getValue }) => (
        <div className="max-w-[400px] truncate" title={getValue() ?? undefined}>
          {getValue()}
        </div>
      ),
      meta: {
        title: t('description'),
        csv: true
      }
    }),
    columnHelper.accessor("priority", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('priority')} />
      ),
      cell: (priority) => {
        const priorityValue = priority.getValue();
        return <TicketPriorityBadge priority={priorityValue} />;
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue<string>(id))
      },
      meta: {
        title: t('priority'),
        csv: true
      }
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('status')} />
      ),
      cell: (status) => {
        const statusValue = status.getValue();
        return <TicketStatusBadge status={statusValue} />;
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue<string>(id))
      },
      meta: {
        title: t('status'),
        csv: true
      }
    }),
    columnHelper.accessor("agentId", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('agent')} />
      ),
      cell: (agentId) => {
        const userId = agentId.getValue();
        return (
          userId ? <UserWithAvatar userId={userId} /> : t('unassigned')
        );
      },
      meta: {
        title: t('agent'),
        csv: true
      }
    }),
    columnHelper.accessor(row => row.team?.name, {
      id: 'team',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('team')} />
      ),
      cell: (team) => {
        const teamName = team.getValue();
        return (
          <div>{teamName ?? t('noTeamAssigned')}</div>
        );
      },
      meta: {
        title: t('team'),
        csv: true
      }
    }),
    columnHelper.accessor("dueAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('dueAt')} />
      ),
      cell: (dueAt) => {
        const dateValue = dueAt.getValue();
        return (
          <div>{dateValue ? formatter.dateTime(dateValue) : '-'}</div>
        );
      },
      meta: {
        title: t('dueAt'),
        csv: true
      }
    }),
    columnHelper.accessor("closedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('closedAt')} />
      ),
      cell: (closedAt) => {
        const dateValue = closedAt.getValue();
        return (
          <div>{dateValue ? formatter.dateTime(dateValue) : '-'}</div>
        );
      },
      meta: {
        title: t('closedAt'),
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
    columnHelper.display({
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={""} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link href={`/tickets/${row.original.id}`}>
            <Icons.view className="h-4 w-4" />
          </Link>
          <Link href={`/tickets/${row.original.id}/edit`}>
            <Icons.edit className="h-4 w-4" />
          </Link>
        </div>
      ),
      enableResizing: false,
    }),
    // dirty fix as https://github.com/TanStack/table/issues/4302
  ] as ColumnDef<TicketGetAllItem, unknown>[],
  [columnHelper, formatter, t])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => <TicketDataTableToolbar table={table} />}
      className={className}
      initialColumnVisibility={initialColumnVisibility}
      onRowDoubleClick={(row) => router.push(`/tickets/${row.id}`)}
    />
  )
}