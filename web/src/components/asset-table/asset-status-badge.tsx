"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { type AssetStatus } from "@prisma/client"

interface AssetStatusBadgeProps {
  status: AssetStatus
}

export function AssetStatusBadge({ status }: AssetStatusBadgeProps) {
  const t = useTranslations('AssetStatus')

  const statusClassMap: Record<AssetStatus, string> = {
    "ACTIVE": "bg-[var(--status-success)] hover:bg-[var(--status-success-hover)] text-white",
    "INACTIVE": "bg-[var(--status-warning)] hover:bg-[var(--status-warning-hover)] text-white",
    "DECOMMISSIONED": "bg-[var(--status-inactive)] hover:bg-[var(--status-inactive-hover)] text-white"
  }

  return (
    <Badge className={statusClassMap[status]}>
      {t(status.toLowerCase())}
    </Badge>
  )
}
