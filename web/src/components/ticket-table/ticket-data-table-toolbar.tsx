import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "../data-table/data-table-faceted-filter";
import { useTranslations } from "next-intl";
import { TicketPriority, TicketStatus } from "@prisma/client";
import { useMemo } from "react";
import { TicketStatusBadge } from "./ticket-status-badge";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import type { TicketGetAllItem } from "@/types";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketBulkStatusUpdate } from "./ticket-bulk-status-update";

export function TicketDataTableToolbar({
  table,
}: {
  table: Table<TicketGetAllItem>;
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const tTicketPriority = useTranslations("TicketPriority");
  const tTicketStatus = useTranslations("TicketStatus");
  const t = useTranslations("TicketDataTableToolbar");

  const priorityOptions = useMemo(
    () =>
      Object.values(TicketPriority).map((priority) => ({
        label: tTicketPriority(priority),
        node: <TicketPriorityBadge priority={priority} />,
        value: priority,
      })),
    [tTicketPriority]
  );

  const statusOptions = useMemo(
    () =>
      Object.values(TicketStatus).map((status) => ({
        label: tTicketStatus(status),
        node: <TicketStatusBadge status={status} />,
        value: status,
      })),
    [tTicketStatus]
  );

  const selectedTicketIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder={t("columns.title.placeholder")}
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title={t("columns.status.label")}
          options={statusOptions}
        />
      )}
      {table.getColumn("priority") && (
        <DataTableFacetedFilter
          column={table.getColumn("priority")}
          title={t("columns.priority.label")}
          options={priorityOptions}
        />
      )}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          {t("reset")}
          <Icons.x />
        </Button>
      )}
      <TicketBulkStatusUpdate
        selectedTicketIds={selectedTicketIds}
        onSuccess={() => table.resetRowSelection()}
      />
    </div>
  );
}