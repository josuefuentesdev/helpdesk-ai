"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { type TicketPriority } from "@prisma/client"
import { Icons } from "@/components/icons"

interface TicketPriorityBadgeProps {
  priority: TicketPriority
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const t = useTranslations('TicketPriority')
  const Icon = Icons[priority]

  return (
    <Badge variant="outline">
      <Icon className="mr-2 h-4 w-4" />
      {t(priority)}
    </Badge>
  )
}
