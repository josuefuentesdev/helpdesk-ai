"use client"

import { TicketForm } from "@/components/ticket-form/ticket-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import { api } from "@/trpc/react"
import { type createFormSchema } from "./ticket-form-schemas"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function CreateTicketForm() {
  const t = useTranslations('CreateTicketForm')
  const router = useRouter();

  const mutation = api.ticket.create.useMutation({
    onSuccess: (data) => {
      toast.success(t('success'))
      router.push(`/tickets/${data.id}`)
    },
    onError: (error) => {
      console.error("Error creating ticket:", error)
      toast.error(t('error'))
    },
  })

  return (
    <TicketForm
      variant="create"
      onSubmit={function (values: z.infer<typeof createFormSchema>) {
        mutation.mutate({
          ...values,
        })
      }}
    />
  )
}