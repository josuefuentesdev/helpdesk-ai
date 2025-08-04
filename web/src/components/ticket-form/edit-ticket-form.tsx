"use client"

import { TicketForm } from "@/components/ticket-form/ticket-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import type { TicketGetOne } from "@/types"
import { api } from "@/trpc/react"
import { type editFormSchema } from "./ticket-form-schemas"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function EditTicketForm({
  ticket,
}: {
  ticket: TicketGetOne,
}) {
  const router = useRouter();
  const t = useTranslations("EditTicketForm");

  const mutation = api.ticket.updateOne.useMutation({
    onSuccess: () => {
      toast.success(t("toast.success"))
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating ticket:", error)
      toast.error(t("toast.error"))
    },
  })

  return (
    <TicketForm
      variant="edit"
      ticket={ticket}
      onSubmit={function (values: z.infer<typeof editFormSchema>) {
        mutation.mutate({
          ...values,
          id: ticket.id,
        })
      }}
    />
  )
}