import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { UserGetAllItem } from "@/types";
import { DepartmentFacetedFilter } from "../data-table/department-faceted-filter";

export function UserDataTableToolbar({
  table,
}: {
  table: Table<UserGetAllItem>
}) {
  const isFiltered = table.getState().columnFilters.length > 0
  const t = useTranslations('UserDataTableToolbar');

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
      <Input
        placeholder={t('columns.email.placeholder')}
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      {table.getColumn("department") && (
        <DepartmentFacetedFilter
          table={table}
          column={table.getColumn("department")}
          title={t('columns.department.label')}
        />
      )}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          {t('reset')}
          <Icons.x className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
