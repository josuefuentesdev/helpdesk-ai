"use client"

import { useState } from "react"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { type Table } from "@tanstack/react-table"
import { Settings2, Check, EyeOff, Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [searchQuery, setSearchQuery] = useState("");

  const t = useTranslations('DataTableViewOptions');

  // Get all hideable columns
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  const allColumnsVisible = columns.every((column) => column.getIsVisible())
  const someColumnsVisible = columns.some((column) => column.getIsVisible())

  // Filter columns based on search query
  const filteredColumns = columns.filter((column) => 
    column.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex items-center gap-1.5"
        >
          <Settings2 className="h-4 w-4" />
          <span>{t('view')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px] p-0">
        <Command>
          <CommandInput
            placeholder={t('searchColumns')}
            className="h-9 w-full text-sm"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandGroup className="p-1.5" heading="Toggle columns">
              <CommandItem
                onSelect={() => {
                  columns.forEach((column) => column.toggleVisibility(!!(!allColumnsVisible)))
                }}
                className="flex cursor-pointer select-none items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  {allColumnsVisible ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : someColumnsVisible ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{t('selectAll')}</span>
                </div>
                <Check 
                  className={`h-4 w-4 ${allColumnsVisible ? "opacity-100 text-primary" : "opacity-0"}`}
                />
              </CommandItem>
              
              <div className="my-1 h-px bg-border" />
              
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {t('noColumnsFound')}
              </CommandEmpty>
              
              {filteredColumns.map((column) => {
                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                    className="flex cursor-pointer select-none items-center justify-between rounded-md px-2 py-1.5 text-sm capitalize hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      {column.getIsVisible() ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{column.id}</span>
                    </div>
                    <Check 
                      className={`h-4 w-4 ${column.getIsVisible() ? "opacity-100 text-primary" : "opacity-0"}`}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
