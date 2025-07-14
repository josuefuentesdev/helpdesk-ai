"use client"

import { TicketForm } from "@/components/ticket-form/ticket-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import type { TicketGetOne } from "@/types"
import { api } from "@/trpc/react"
import { type editFormSchema } from "./ticket-form-schemas"
import { toast } from "sonner"

export function EditTicketForm({
  ticket,
}: {
  ticket: TicketGetOne,
}) {
  const router = useRouter();

  const mutation = api.ticket.updateOne.useMutation({
    onSuccess: () => {
      toast.success("Ticket updated successfully")
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating ticket:", error)
      toast.error("Error updating ticket")
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