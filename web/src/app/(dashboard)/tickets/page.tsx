import { TicketDataTable } from "@/components/ticket-table/ticket-data-table"
import { api } from "@/trpc/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { getTranslations } from "next-intl/server"

export default async function TicketsPage() {
  const t = await getTranslations('TicketsPage')
  const tickets = await api.ticket.getAll()
  return (
    <PageLayout
      title={t('title')}
      actions={
        <Button asChild>
          <Link href="/tickets/new">{t('newTicket')}</Link>
        </Button>
      }
    >
      <TicketDataTable
        data={tickets}
        className="h-[calc(100vh-var(--header-height)-6rem)]"
        initialColumnVisibility={{
          id: false,
          createdAt: false,
          updatedAt: false,
        }}
      />
    </PageLayout>
  )
}