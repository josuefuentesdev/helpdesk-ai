import { notFound } from "next/navigation"
import { TicketForm } from "@/components/ticket-form/ticket-form"
import { api } from "@/trpc/server"
import { CommentSection } from '@/components/ticket-form/comment-section';

export default async function TicketPage({
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
      <TicketForm ticket={ticket} variant="view"/>
      <CommentSection ticketId={ticket.id} />
    </div>
  )
}