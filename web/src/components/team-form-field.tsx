"use client"

import React, { useMemo } from "react"
import type { Control, FieldValues, FieldPath } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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

type TeamFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled?: boolean
}

export function TeamFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: TeamFormFieldProps<TFieldValues, TName>) {
  const t = useTranslations('TeamFormField')
  const [open, setOpen] = React.useState(false)

  const { data: teams, isPending, error } = api.team.getAll.useQuery()

  type TeamOption = {
    label: string
    value: string
  }

  const options = useMemo<TeamOption[]>(() => {
    if (!teams) return []
    return teams.map((team) => ({
      label: team.name,
      value: team.id,
    }))
  }, [teams])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value = [] as string[], onChange } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t('label')}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled || isPending}>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[300px] justify-between",
                    !value?.length && !isPending && "text-muted-foreground"
                  )}
                >
                  {isPending ? (
                    <>
                      <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                      {t('loadingPlaceholder')}
                    </>
                  ) : value?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[250px] overflow-hidden">
                      {value.map((teamId: string) => (
                        <Badge key={teamId} variant="secondary" className="mr-1 mb-1">
                          {options.find(opt => opt.value === teamId)?.label ?? teamId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    t('placeholder')
                  )}
                  <Icons.chevronsUpDown className="ml-auto opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
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
                      {options.map((option) => {
                        const isSelected = value?.includes(option.value)
                        return (
                          <CommandItem
                            value={option.label}
                            key={option.value}
                            onSelect={() => {
                              const currentValues = Array.isArray(value) ? value : []
                              const newValue = isSelected
                                ? currentValues.filter((v) => v !== option.value)
                                : [...currentValues, option.value]
                              onChange(newValue)
                            }}
                          >
                            <div className="flex items-center">
                              <div className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}>
                                <Icons.check className="h-4 w-4" />
                              </div>
                              {option.label}
                            </div>
                          </CommandItem>
                        )
                      })}
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
              {t('fetchErrorPlaceholder', { error: error.message ?? 'Unknown error' })}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}