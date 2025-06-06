"use client"

import type { Control, FieldValues, FieldPath } from "react-hook-form"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AssetStatus } from "@prisma/client"
import { Icons } from "@/components/icons"


type AssetStatusFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled: boolean
}

export function AssetStatusFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: AssetStatusFormFieldProps<TFieldValues, TName>) {
  const t = useTranslations('AssetStatusFormField');

  // Status color mapping using the same variables as asset-status-badge
  const statusColorMap: Record<AssetStatus, string> = {
    "ACTIVE": "var(--status-success)",
    "INACTIVE": "var(--status-warning)",
    "DECOMMISSIONED": "var(--status-inactive)"
  }

  const options = Object.values(AssetStatus)
    .map((status) => ({
      label: t(`statuses.${status}`),
      value: status,
      color: statusColorMap[status]
    }))

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t('label')}</FormLabel>
          <Popover>
            <PopoverTrigger asChild disabled={disabled}>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {field.value && (
                      <div 
                        className="w-3 h-3 rounded-sm flex-shrink-0" 
                        style={{ backgroundColor: options.find(option => option.value === field.value)?.color }}
                      />
                    )}
                    <span>
                      {field.value
                        ? options.find(
                          (option) => option.value === field.value
                        )?.label
                        : t('placeholder')}
                    </span>
                  </div>
                  <Icons.chevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={t('searchPlaceholder')}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{t('noResults')}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          field.onChange(option.value)
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0" 
                            style={{ backgroundColor: option.color }}
                          />
                          <span>{option.label}</span>
                        </div>
                        <Icons.check
                          className={cn(
                            "ml-auto",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            {t('description')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
