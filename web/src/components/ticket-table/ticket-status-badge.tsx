"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { type TicketStatus } from "@prisma/client"

interface TicketStatusBadgeProps {
  status: TicketStatus
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const t = useTranslations('TicketStatus')

  const statusClassMap: Record<TicketStatus, string> = {
    "OPEN": "bg-[var(--ticket-status-open)] hover:bg-[var(--ticket-status-open-hover)] text-white",
    "IN_PROGRESS": "bg-[var(--ticket-status-in-progress)] hover:bg-[var(--ticket-status-in-progress-hover)] text-white",
    "RESOLVED": "bg-[var(--ticket-status-resolved)] hover:bg-[var(--ticket-status-resolved-hover)] text-white",
    "CLOSED": "bg-[var(--ticket-status-closed)] hover:bg-[var(--ticket-status-closed-hover)] text-white"
  }

  return (
    <Badge className={statusClassMap[status]}>
      {t(status)}
    </Badge>
  )
}
