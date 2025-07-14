"use client"

import React, { useMemo } from "react"
import type { Control, FieldValues, FieldPath } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
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
import { Icons } from "@/components/icons"
import { useTranslations } from "next-intl"
import { api } from "@/trpc/react"


type DepartmentFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled?: boolean
}


export function DepartmentFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: DepartmentFormFieldProps<TFieldValues, TName>) {
  const t = useTranslations('DepartmentFormField');
  const [open, setOpen] = React.useState(false)

  const { data: departments, isPending, error } = api.department.getAll.useQuery()

  const options = useMemo(() => {
    if (!departments) return []
    return departments.map((department) => ({
      label: department.name,
      value: department.id,
    }))
  }, [departments])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t('label')}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled || isPending}>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && !isPending && "text-muted-foreground"
                  )}
                >
                  {isPending ? (
                    <>
                      <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                      {t('loadingPlaceholder')}
                    </>
                  ) : field.value ? (
                    options.find((option) => option.value === field.value)?.label
                  ) : (
                    t('placeholder')
                  )}
                  {!isPending && <Icons.chevronsUpDown className="ml-auto opacity-50" />}
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
                  {isPending ? (
                    <CommandLoading>{t('loadingOptions')}</CommandLoading>
                  ) : options.length === 0 ? (
                    <CommandEmpty>{t('noResults')}</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            field.onChange(option.value)
                            setOpen(false)
                          }}
                        >
                          <div className="flex items-center">
                            {option.label}
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
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            {t('description')}
          </FormDescription>
          {error && (
            <p className="text-sm font-medium text-destructive pt-1">
              {t('fetchErrorPlaceholder', { error: error.message })}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
