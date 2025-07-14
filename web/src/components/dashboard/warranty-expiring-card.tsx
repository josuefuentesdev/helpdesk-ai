"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/react"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import React from "react"
import { useTranslations } from "next-intl"

interface WarrantyExpiringCardProps {
  className?: string
}

function LoadingState() {
  return (
    <div className="h-full space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icons.alert className="mb-3 h-10 w-10 text-destructive" />
      <p className="text-destructive">Failed to load assets</p>
      <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icons.alert className="mb-3 h-10 w-10 text-muted-foreground/50" />
      <p className="text-muted-foreground">No warranties expiring soon</p>
      <p className="text-sm text-muted-foreground/70 mt-1">Check back later for updates</p>
    </div>
  )
}

export function WarrantyExpiringCard({ className }: WarrantyExpiringCardProps) {
  const t = useTranslations('WarrantyExpiringCard')
  const { data: assets, isPending, error } = api.dashboard.getAssetsWithWarrantyExpiring.useQuery(
    { limit: 50, days: 30 }
  )

  let content: React.ReactNode
  if (isPending) {
    content = <LoadingState />
  } else if (error) {
    content = <ErrorState />
  } else if (assets && assets.length > 0) {
    content = (
      <>
        {assets.map((asset) => (
          <Link
            key={asset.id}
            href={`/assets/${asset.id}`}
            className="group block"
          >
            <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50">
              <div className="flex-none">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Icons.assets className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium group-hover:underline">
                  {asset.name}
                </p>
                <div className="flex items-center mt-1 space-x-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs font-normal">
                    {asset.type}
                  </Badge>
                  <span>•</span>
                  <span>{t('expiresIn', { days: asset.daysUntilExpiry })}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 flex-shrink-0">
                <Icons.chevronsUpDown className="h-4 w-4 rotate-90" />
                <span className="sr-only">{t('viewAsset')}</span>
              </Button>
            </div>
          </Link>
        ))}
      </>
    )
  } else {
    content = <EmptyState />
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{t('title')}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assets">
            {t('viewAll')}
            <Icons.chevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full overflow-hidden">
          {content}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
