import { PageLayout } from "@/components/page-layout";
import { TicketDataTable } from "@/components/ticket-table/ticket-data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <PageLayout
      title="Tickets"
      actions={
        <Button asChild>
          <Link href="/tickets/new">New Ticket</Link>
        </Button>
      }
    >
      <TicketDataTable />
    </PageLayout>
  )
}