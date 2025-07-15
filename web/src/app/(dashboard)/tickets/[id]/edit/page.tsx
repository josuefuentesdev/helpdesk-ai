import { notFound } from "next/navigation"
import { api } from "@/trpc/server"
import { EditTicketForm } from "@/components/ticket-form/edit-ticket-form"
import { CommentSection } from '@/components/ticket-form/comment-section';

export default async function EditTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const ticket = await api.ticket.getOne({
    id: id,
  })

  if (!ticket) {
    notFound()
  }


  return (
    <div className="max-w-2xl px-6 py-8">
      <EditTicketForm ticket={ticket} />
      <CommentSection ticketId={ticket.id} />
    </div>
  )
}