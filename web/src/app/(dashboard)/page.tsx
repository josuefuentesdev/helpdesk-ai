"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card"
import { api } from "@/trpc/react"
import { Icons } from "@/components/icons"
import { RecentTickets } from "./recent-tickets"
import { Analytics, AnalyticsSkeleton } from "./analytics"
import { WarrantyExpiringCard } from "@/components/dashboard/warranty-expiring-card"
import { useTranslations } from "next-intl"

export default function DashboardPage() {
  const { data: dashboardStats, isPending, error } = api.dashboard.getStats.useQuery()
  const t = useTranslations("DashboardStats")

  if (error) {
    throw new Error(error.message)
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
        <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="">
        <div className="flex flex-col h-[calc(100vh-var(--header-height)-7rem)] space-y-4 ">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {isPending ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title={t("open")}
                  value={dashboardStats?.open ?? 0}
                  icon={Icons.ticket}
                  trend={dashboardStats?.openTrend ?? 0}
                />
                <StatCard
                  title={t("inProgress")}
                  value={dashboardStats?.inProgress ?? 0}
                  icon={Icons.clock}
                  trend={dashboardStats?.inProgressTrend ?? 0}
                />
                <StatCard
                  title={t("resolved")}
                  value={dashboardStats?.resolved ?? 0}
                  icon={Icons.check}
                  trend={dashboardStats?.resolvedTrend ?? 0}
                />
                <StatCard
                  title={t("activeAssets")}
                  value={dashboardStats?.active ?? 0}
                  icon={Icons.assets}
                  trend={dashboardStats?.activeTrend ?? 0}
                />
              </>
            )}
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
            <RecentTickets className="h-full flex-1 md:flex-[4]" />
            <WarrantyExpiringCard className="h-full flex-1 md:flex-[3]" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
        {isPending ? (
          <AnalyticsSkeleton />
        ) : (
          <Analytics dashboardStats={dashboardStats} />
        )}
      </TabsContent>
    </Tabs>
  )
}