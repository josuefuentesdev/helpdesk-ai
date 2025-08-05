import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { UserGetAllItem } from "@/types";
import { DepartmentFacetedFilter } from "../data-table/department-faceted-filter";
import { TeamFacetedFilter } from "../data-table/team-faceted-filter";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
        className="max-w-sm min-w-[130px]"
      />
      <Input
        placeholder={t('columns.email.placeholder')}
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm min-w-[130px]"
      />
      {table.getColumn("department") && (
        <DepartmentFacetedFilter
          table={table}
          column={table.getColumn("department")}
          title={t('columns.department.label')}
        />
      )}
      {table.getColumn("teams") && (
        <TeamFacetedFilter
          table={table}
          column={table.getColumn("teams")}
          title={t('columns.team.label')}
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
      {/* Tooltip warning for sample users */}
      <div className="m-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Icons.alert className="text-yellow-500 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t('sampleWarning')}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
