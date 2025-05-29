"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { type AssetType } from "@prisma/client"
import { Icons } from "@/components/icons"

interface AssetTypeBadgeProps {
  type: AssetType
}

export function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  const t = useTranslations('AssetType')
  const Icon = Icons[type]

  return (
    <Badge>
      <Icon className="mr-2 h-4 w-4" />
      {t(type.toLowerCase())}
    </Badge>
  )
}
