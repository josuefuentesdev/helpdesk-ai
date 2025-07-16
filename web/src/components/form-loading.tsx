import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function FormLoading() {
  // Explicitly type the array as number[] to avoid linter error
  const fieldCount: number[] = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="max-w-2xl px-6 py-8 space-y-6">
      {/* Header: title, description, edit button, icon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48 mb-2" /> {/* Title */}
            <Skeleton className="h-4 w-64" /> {/* Description */}
          </div>
          <div className="flex items-center gap-2">
            <Button disabled variant="outline" size="sm" className="pointer-events-none">
              <Skeleton className="h-4 w-16 mr-2" /> {/* Edit icon + text */}
            </Button>
            <div className="rounded-lg bg-primary/10 p-3 flex items-center justify-center">
              <Skeleton className="h-6 w-6" /> {/* Asset icon */}
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 my-4" />
      </div>
      {/* Form fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 10 fields: name, type, status, subtype, vendor, identifier, model, serial number, purchase date, warranty date, assigned user */}
        {fieldCount.map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32 mb-1" /> {/* Label */}
            <Skeleton className="h-9 w-full" /> {/* Input/select */}
            <Skeleton className="h-3 w-24" /> {/* Description */}
          </div>
        ))}
      </div>
      {/* Audit fields skeleton */}
      <div className="mt-8">
        <Skeleton className="h-4 w-32 mb-4" /> {/* Audit title */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col space-y-2 rounded-md bg-background/50 p-3">
            <Skeleton className="h-4 w-24 mb-1" /> {/* Created by label */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex flex-col space-y-2 rounded-md bg-background/50 p-3">
            <Skeleton className="h-4 w-24 mb-1" /> {/* Updated by label */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 