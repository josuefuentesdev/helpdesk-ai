import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";


export function AssetDataTableToolbar<TData>({
  table,
}: {
  table: Table<TData>
}) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter by name..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
}