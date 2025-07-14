'use client'

import type { Control, FieldValues, FieldPath } from "react-hook-form"
import { useTranslations } from "next-intl"
import { api } from "@/trpc/react"

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
import { Icons } from "@/components/icons"


type TeamFormFieldProps< 
TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled: boolean
}

export function TeamFormField< 
TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: TeamFormFieldProps<TFieldValues, TName>) {
  const t = useTranslations('TeamFormField');
  const { data: teams, isLoading, isError, error } = api.team.getAll.useQuery() as {
    data: { id: string; name: string; }[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: { message: string } | null;
  };

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
                  {isLoading ? (
                    t('loadingPlaceholder')
                  ) : isError ? (
                    t('fetchErrorPlaceholder', { error: error?.message ?? '' })
                  ) : (
                    field.value
                      ? teams?.find(
                        (team) => team.id === field.value
                      )?.name
                      : t('placeholder')
                  )}
                  <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    {isLoading ? (
                      <CommandItem disabled>{t('loadingOptions')}</CommandItem>
                    ) : (
                      teams?.map((team) => (
                        <CommandItem
                          value={team.name}
                          key={team.id}
                          onSelect={() => {
                            field.onChange(team.id)
                          }}
                        >
                          {team.name}
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4",
                              team.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))
                    )}
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
