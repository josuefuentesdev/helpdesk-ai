import { TicketDataTable } from "@/components/ticket-table/ticket-data-table";

export default function Page() {
  return (
    <div className="hidden h-full flex-1 flex-col p-4 md:flex">
      <TicketDataTable />
    </div>
  )
}