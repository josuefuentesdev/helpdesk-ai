'use client'

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
import { TicketPriority } from "@prisma/client"
import { Icons } from "@/components/icons"


type TicketPriorityFormFieldProps< 
TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled: boolean
}

export function TicketPriorityFormField< 
TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: TicketPriorityFormFieldProps<TFieldValues, TName>) {
  const t = useTranslations('TicketPriorityFormField');

  const priorityColorMap: Record<TicketPriority, string> = {
    "LOW": "var(--priority-low)",
    "MEDIUM": "var(--priority-medium)",
    "HIGH": "var(--priority-high)",
    "URGENT": "var(--priority-urgent)",
  }

  const options = Object.values(TicketPriority)
    .map((priority) => ({
      label: t(`priorities.${priority}`),
      value: priority,
      color: priorityColorMap[priority]
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
