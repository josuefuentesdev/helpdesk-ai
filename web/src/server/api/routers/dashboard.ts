import { z } from "zod"
import { subDays, format, startOfDay, addDays as addDaysFns } from "date-fns"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import type { TicketStatus, TicketPriority, Prisma } from "@prisma/client"

type Period = {
  start: Date
  end: Date
}

interface DashboardStats {
  open: number
  openTrend: number
  inProgress: number
  inProgressTrend: number
  resolved: number
  resolvedTrend: number
  closed: number
  active: number
  activeTrend: number
  inactive: number
  decommissioned: number
  assetTypes: Array<{ type: string; count: number }>
  ticketTrend: Array<{ date: string; count: number }>
}

type RecentTicket = {
  id: string
  title: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: Date
}

type TicketCounts = {
  open: number
  inProgress: number
  resolved: number
  closed: number
}

type AssetCounts = {
  active: number
  inactive: number
  decommissioned: number
  assetTypes: Array<{ type: string | null; _count: number }>
}

// Helper functions
const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

const getPeriods = (): { current: Period; previous: Period } => {
  const now = new Date()
  const oneMonthAgo = subDays(now, 30)
  const twoMonthsAgo = subDays(now, 60)

  return {
    current: { start: oneMonthAgo, end: now },
    previous: { start: twoMonthsAgo, end: oneMonthAgo }
  }
}

// Database queries
const getTicketCounts = async (ctx: { db: Prisma.TransactionClient }, period: Period): Promise<TicketCounts> => {
  const [open, inProgress, resolved, closed] = await Promise.all([
    ctx.db.ticket.count({ where: { status: 'OPEN', createdAt: { gte: period.start } } }),
    ctx.db.ticket.count({ where: { status: 'IN_PROGRESS', updatedAt: { gte: period.start } } }),
    ctx.db.ticket.count({
      where: {
        status: 'RESOLVED',
        updatedAt: { gte: period.start, lt: period.end }
      }
    }),
    ctx.db.ticket.count({ where: { status: 'CLOSED', updatedAt: { gte: period.start } } })
  ])

  return { open, inProgress, resolved, closed }
}

const getAssetCounts = async (ctx: { db: Prisma.TransactionClient }): Promise<Omit<AssetCounts, 'assetTypes'> & { assetTypes: Array<{ type: string | null; _count: number }> }> => {
  const [active, inactive, decommissioned, assetTypes] = await Promise.all([
    ctx.db.asset.count({ where: { status: 'ACTIVE' } }),
    ctx.db.asset.count({ where: { status: 'INACTIVE' } }),
    ctx.db.asset.count({ where: { status: 'DECOMMISSIONED' } }),
    ctx.db.asset.groupBy({
      by: ['type'],
      _count: true,
    })
  ])

  return { active, inactive, decommissioned, assetTypes }
}

const getTicketTrends = async (ctx: { db: Prisma.TransactionClient }, days = 30): Promise<Array<{ date: string; count: number }>> => {
  const today = startOfDay(new Date())
  const trendData: Array<{ date: string; count: number }> = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i)
    const count = await ctx.db.ticket.count({
      where: {
        createdAt: {
          gte: startOfDay(date),
          lt: startOfDay(addDaysFns(date, 1)),
        },
      },
    })

    trendData.push({
      date: format(date, 'MMM dd'),
      count,
    })
  }

  return trendData
}

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }): Promise<DashboardStats> => {
    const { current, previous } = getPeriods()

    // Fetch data for current and previous periods in parallel
    const [
      currentTicketCounts,
      previousTicketCounts,
      assetData,
      ticketTrend
    ] = await Promise.all([
      getTicketCounts(ctx, current),
      getTicketCounts(ctx, { ...previous, end: current.start }),
      getAssetCounts(ctx),
      getTicketTrends(ctx)
    ])

    // Calculate trends
    const trends = {
      open: calculateTrend(currentTicketCounts.open, previousTicketCounts.open),
      inProgress: calculateTrend(currentTicketCounts.inProgress, previousTicketCounts.inProgress),
      resolved: calculateTrend(currentTicketCounts.resolved, previousTicketCounts.resolved),
      active: calculateTrend(assetData.active, 0) // No previous period for active assets in this example
    }

    return {
      ...currentTicketCounts,
      ...{
        active: assetData.active,
        inactive: assetData.inactive,
        decommissioned: assetData.decommissioned,
        openTrend: trends.open,
        inProgressTrend: trends.inProgress,
        resolvedTrend: trends.resolved,
        activeTrend: trends.active,
        assetTypes: assetData.assetTypes.map(({ type, _count }) => ({
          type: type ?? 'Unknown',
          count: _count,
        })),
        ticketTrend,
      },
    }
  }),

  getAssetsWithWarrantyExpiring: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).default(30),
        limit: z.number().min(1).max(100).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const today = new Date()
      const endDate = addDaysFns(today, input.days)

      const assets = await ctx.db.asset.findMany({
        where: {
          warrantyExpiresAt: {
            gte: today,
            lte: endDate,
          },
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          warrantyExpiresAt: true,
          type: true,
        },
        orderBy: {
          warrantyExpiresAt: 'asc',
        },
        take: input.limit,
      })

      return assets.map(asset => ({
        ...asset,
        daysUntilExpiry: Math.ceil(((asset.warrantyExpiresAt?.getTime() ?? 0) - today.getTime()) / (1000 * 60 * 60 * 24)),
      }))
    }),

  getRecentTickets: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(5),
      })
    )
    .query(async ({ ctx, input }): Promise<RecentTicket[]> => {
      return ctx.db.ticket.findMany({
        take: input.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      })
    }),
})