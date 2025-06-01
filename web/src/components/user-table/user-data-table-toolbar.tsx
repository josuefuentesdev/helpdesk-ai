import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function UserDataTableToolbar<TData>({
  table,
}: {
  table: Table<TData>
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
