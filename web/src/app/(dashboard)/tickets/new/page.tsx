import { CreateTicketForm } from "@/components/ticket-form/create-ticket-form"

export default async function NewTicketPage() {
  return (
    <div className="max-w-2xl px-6 py-8">
      <CreateTicketForm />
    </div>
  )
}