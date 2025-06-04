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
import { UserAvatar } from "@/components/user-avatar"
import { api } from "@/trpc/react"

type UserFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  disabled?: boolean
}

export function UserFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  disabled = false,
}: UserFormFieldProps<TFieldValues, TName>) {
  
  const { data: users, isPending, error } = api.user.getAllIdentifiers.useQuery()

  const t = useTranslations("UserFormField");
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
        <p>{t('errorLoadingUsers')}</p>
      </div>
    )
  }

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
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar 
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        user={users?.find((user) => user.id === field.value) || { name: "", image: null }}
                        className="h-4 w-4"
                      />
                      <span>{users?.find((user) => user.id === field.value)?.name}</span>
                    </div>
                  ) : (
                    <span>{t('placeholder')}</span>
                  )}
                  <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder={t('searchPlaceholder')} className="h-9" />
                <CommandEmpty>{t('noResults')}</CommandEmpty>
                <CommandList>
                  {isPending ? (
                    <CommandLoading>
                      <div className="flex items-center justify-center py-6">
                        <Icons.check className="h-4 w-4 animate-spin" />
                        <span className="ml-2">{t('loading')}</span>
                      </div>
                    </CommandLoading>
                  ) : (
                    <CommandGroup>
                      {users?.map((user) => (
                      <CommandItem
                        value={`${user.name} ${user.email}`}
                        key={user.id}
                        onSelect={() => {
                          field.onChange(user.id)
                        }}
                        className="flex items-center gap-2"
                      >
                        <UserAvatar user={user} className="h-5 w-5" />
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        <Icons.check
                          className={cn(
                            "ml-auto h-4 w-4",
                            user.id === field.value ? "opacity-100" : "opacity-0"
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
          <FormDescription className="text-muted-foreground/70">
            {t('description')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
