import { Skeleton } from "@/components/ui/skeleton";

export function LoadingDataTable() {
  const columns: number[] = Array.from({ length: 8 }, (_, i) => i);
  const rows: number[] = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="flex flex-col">
      {/* Toolbar skeleton */}
      <div className="flex items-center space-x-2 mb-2">
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
      {/* Table skeleton */}
      <div className="rounded-md border flex-1 min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {columns.map((i) => (
                  <th key={i} className="px-2 py-3 font-medium text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((rowIdx) => (
                <tr key={rowIdx} className="border-b">
                  {columns.map((colIdx) => (
                    <td key={colIdx} className="px-2 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}