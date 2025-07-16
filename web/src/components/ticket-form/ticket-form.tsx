"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import type { TicketGetOne } from "@/types"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { baseFormSchema, type TicketFormValues } from "./ticket-form-schemas"
import { UserFormField } from "@/components/user-form-field"
import { AuditFieldsDisplay } from "@/components/audit-fields-display"
import { TicketPriorityFormField } from "./ticket-priority-form-field";
import { TicketStatusFormField } from "./ticket-status-form-field";
import { TeamFormField } from "./team-form-field";
import { Textarea } from "@/components/ui/textarea";
import { AssetDateFormField } from "@/components/asset-date-form-field";
import { TicketCommentList } from "./ticket-comment-list";

type TicketFormProps =
  | {
    variant: "view";
    ticket: TicketGetOne;
    onSubmit?: never;
  }
  | {
    variant: "edit";
    ticket: TicketGetOne;
    onSubmit: (values: TicketFormValues) => void;
  }
  | {
    variant: "create";
    ticket?: never;
    onSubmit: (values: TicketFormValues) => void;
  };

export function TicketForm({
  ticket,
  variant,
  onSubmit,
}: TicketFormProps) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      title: ticket?.title ?? "",
      description: ticket?.description ?? "",
      priority: ticket?.priority ?? undefined,
      status: ticket?.status ?? undefined,
      dueAt: ticket?.dueAt ?? undefined,
      agentId: ticket?.agentId ?? undefined,
      teamId: ticket?.teamId ?? undefined,
    },
  })

  const t = useTranslations("TicketForm")

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
                <Link href={`/tickets/${ticket.id}/edit`} className="flex items-center">
                  <Icons.edit className="mr-2 h-4 w-4" />
                  {t('actions.edit')}
                </Link>
              </Button>
            )}
            <div className="rounded-lg bg-primary/10 p-3">
              <Icons.ticket className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 my-4" />
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    {t('form.title.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.title.placeholder')}
                      className="bg-background/50"
                      {...field}
                      disabled={variant === "view"}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground/70">
                    {t('form.title.description')}
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    {t('form.description.label')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('form.description.placeholder')}
                      className="bg-background/50"
                      {...field}
                      disabled={variant === "view"}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground/70">
                    {t('form.description.description')}
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TicketPriorityFormField
                control={form.control}
                name="priority"
                disabled={variant === "view"}
              />
              <TicketStatusFormField
                control={form.control}
                name="status"
                disabled={variant === "view"}
              />
              <UserFormField
                control={form.control}
                name="agentId"
                disabled={variant === "view"}
              />
              <TeamFormField
                control={form.control}
                name="teamId"
                disabled={variant === "view"}
              />
              <AssetDateFormField
                control={form.control}
                name="dueAt"
                label={t('form.dueAt.label')}
                placeholder={t('form.dueAt.placeholder')}
                description={t('form.dueAt.description')}
                disabled={variant === "view"}
              />
            </div>
          </div>

          {(variant === "view" || variant === "edit") && ticket && (
            <AuditFieldsDisplay
              createdById={ticket.createdById}
              createdAt={ticket.createdAt}
              updatedAt={ticket.updatedAt}
              updatedById={ticket.updatedById}
            />
          )}

          {/* Comments Section */}
          {(variant === "view" || variant === "edit") && ticket && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">{t("comments")}</h3>
              <TicketCommentList ticketId={ticket.id} editable={variant === "edit"} />
            </div>
          )}

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