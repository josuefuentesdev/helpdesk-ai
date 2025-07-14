"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/react"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { TicketPriorityBadge } from "@/components/ticket-table/ticket-priority-badge"
import { useFormatter, useTranslations } from "next-intl"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { DashboardRecentTicketsItem } from "@/types"

function TicketItem({ ticket }: { ticket: DashboardRecentTicketsItem }) {
  const formatter = useFormatter()
  const t = useTranslations("RecentTickets")

  return (
    <Link href={`/tickets/${ticket.id}`} className="group block">
      <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent/50">
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium group-hover:underline">
            {ticket.title}
          </p>
          <div className="flex items-center mt-1 space-x-2 text-xs text-muted-foreground">
            <TicketPriorityBadge priority={ticket.priority} />
            <span>•</span>
            <span>{formatter.dateTime(ticket.createdAt, 'fullShort')}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
          <Icons.chevronsUpDown className="h-4 w-4 rotate-90" />
          <span className="sr-only">{t("viewTicket")}</span>
        </Button>
      </div>
    </Link>
  )
}

function LoadingState() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </ScrollArea>
  )
}

function ErrorState() {
  const t = useTranslations("RecentTickets.error")

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icons.alert className="mb-3 h-10 w-10 text-destructive" />
      <p className="text-destructive">{t("failedToLoad")}</p>
      <p className="text-sm text-muted-foreground mt-1">{t("tryAgainLater")}</p>
    </div>
  )
}

function EmptyState() {
  const t = useTranslations("RecentTickets.emptyState")

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icons.ticket className="mb-3 h-10 w-10 text-muted-foreground/50" />
      <p className="text-muted-foreground">{t("noTickets")}</p>
      <p className="text-sm text-muted-foreground/70 mt-1">{t("createTicket")}</p>
      <Button variant="outline" size="sm" className="mt-4" asChild>
        <Link href="/tickets/new">
          <Icons.plus className="mr-2 h-4 w-4" /> {t("newTicket")}
        </Link>
      </Button>
    </div>
  )
}

export function RecentTickets({ className }: { className?: string }) {
  const { data: recentTickets, isPending, error } = api.dashboard.getRecentTickets.useQuery(
    { limit: 5 }
  )

  const t = useTranslations("RecentTickets")

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tickets">
            {t("viewAll")}
            <Icons.chevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {isPending ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : recentTickets && recentTickets.length > 0 ? (
          <ScrollArea className="h-full overflow-hidden ">
            {recentTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </ScrollArea>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  )
}
