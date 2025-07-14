"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Icons } from "@/components/icons"
import type { UserGetOne } from "@/types"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { baseFormSchema, type UserFormValues } from "./user-form-schemas"
import { DepartmentFormField } from "../department-form-field"
import { LocaleFormField } from "../locale-form-field"
import { TeamFormField } from "../team-form-field"


type UserFormProps =
  | {
    variant: "view";
    user: UserGetOne;
    onSubmit?: never;
  }
  | {
    variant: "edit";
    user: UserGetOne;
    onSubmit: (values: UserFormValues) => void;
  }
  | {
    variant: "create";
    user?: never;
    onSubmit: (values: UserFormValues) => void;
  };

export function UserForm({
  user,
  variant,
  onSubmit,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      locale: user?.locale ?? "en",
      departmentId: user?.departmentId ?? undefined,
      teamIds: user?.teams.map((team) => team.id) ?? [],
    },
  })

  const t = useTranslations("UserForm")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`title.${variant}`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`description.${variant}`)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {variant === "view" && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/users/${user.id}/edit`} className="flex items-center">
                  <Icons.edit className="mr-2 h-4 w-4" />
                  {t('actions.edit')}
                </Link>
              </Button>
            )}
            <div className="rounded-lg bg-primary/10 p-3">
              <Icons.user className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 my-4" />
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
              <LocaleFormField
                control={form.control}
                name="locale"
                disabled={variant === "view"}
              />
              <DepartmentFormField
                control={form.control}
                name="departmentId"
                disabled={variant === "view"}
              />
              <TeamFormField
                control={form.control}
                name="teamIds"
                disabled={variant === "view"}
              />
            </div>

          {(variant === "edit" || variant === "create") && (
            <div className="flex justify-end pt-4">
              <Button type="submit" className="min-w-[120px]">
                {form.formState.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-background border-t-2 border-t-primary rounded-full animate-spin" />
                    {t(`form.submit.loading.${variant}`)}
                  </>
                ) : t(`form.submit.${variant}`)}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
