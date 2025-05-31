import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "../data-table/data-table-faceted-filter";
import { useTranslations } from "next-intl";
import { AssetStatus, AssetType } from "@prisma/client";
import { useMemo } from "react";
import { AssetTypeBadge } from "./asset-type-badge";
import { AssetStatusBadge } from "./asset-status-badge";
import { Button } from "../ui/button";
import { Icons } from "../icons";

export function AssetDataTableToolbar<TData>({
  table,
}: {
  table: Table<TData>
}) {
  const isFiltered = table.getState().columnFilters.length > 0

  const tAssetType = useTranslations('AssetType');
  const tAssetStatus = useTranslations('AssetStatus');

  const typeOptions = useMemo(() => Object.values(AssetType).map((type) => ({
    label: tAssetType(type),
    node: <AssetTypeBadge type={type} />,
    value: type,
  })), [tAssetType]);

  const statusOptions = useMemo(() => Object.values(AssetStatus).map((status) => ({
    label: tAssetStatus(status),
    node: <AssetStatusBadge status={status} />,
    value: status,
  })), [tAssetStatus]);

  const t = useTranslations('AssetDataTableToolbar');

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder={t('columns.name.placeholder')}
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title={t('columns.status.label')}
          options={statusOptions}
        />
      )}
      {table.getColumn("type") && (
        <DataTableFacetedFilter
          column={table.getColumn("type")}
          title={t('columns.type.label')}
          options={typeOptions}
        />
      )}
      {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            {t('reset')}
            <Icons.x />
          </Button>
        )}
    </div>
  );
}