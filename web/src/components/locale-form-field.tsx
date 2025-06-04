"use client"

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
import { Locale } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Icons } from "./icons"


type LocaleFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled: boolean
}

export function LocaleFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: LocaleFormFieldProps<TFieldValues, TName>) {
  const t = useTranslations('LocaleFormField');

  const options = Object.values(Locale)
    .map((type) => ({
      label: t(`types.${type}`),
      value: type,
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
                  {field.value ?
                    (
                    <>
                      {options.find((option) => option.value === field.value)?.label}
                    </>
                  ) : (
                    t('placeholder')
                  )}
                  <Icons.chevronsUpDown className="ml-auto opacity-50" />
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
