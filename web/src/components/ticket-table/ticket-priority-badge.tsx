"use client"

import { Badge } from "@/components/ui/badge"
import { type TicketPriority } from "@prisma/client"
import { Icons } from "@/components/icons"
import { useTranslations } from "next-intl"

interface TicketPriorityBadgeProps {
  priority: TicketPriority
}

const priorityVariants = {
  LOW: "bg-[var(--priority-low)] hover:bg-[var(--priority-low)]/80 text-white",
  MEDIUM: "bg-[var(--priority-medium)] hover:bg-[var(--priority-medium)]/80 text-white",
  HIGH: "bg-[var(--priority-high)] hover:bg-[var(--priority-high)]/80 text-white",
  URGENT: "bg-[var(--priority-urgent)] hover:bg-[var(--priority-urgent)]/80 text-white",
} as const

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const t = useTranslations('TicketPriority')
  const Icon = Icons[priority]
  const variant = priorityVariants[priority]

  return (
    <Badge className={`${variant} border-0`}>
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {t(priority)}
    </Badge>
  )
}
