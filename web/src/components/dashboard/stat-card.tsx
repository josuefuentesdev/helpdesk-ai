import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

type StatCardProps = {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  trend?: number // percentage
  className?: string
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}: StatCardProps) {
  const showTrend = trend !== undefined
  const trendValue = Math.abs(trend ?? 0)
  const TrendIcon = showTrend 
    ? trend > 0 ? ArrowUp : trend < 0 ? ArrowDown : ArrowRight 
    : null
  const t = useTranslations('StatCard')
  const trendColor = showTrend 
    ? trend > 0 
      ? 'text-green-500 dark:text-green-400' 
      : trend < 0 
        ? 'text-red-500 dark:text-red-400' 
        : 'text-muted-foreground'
    : ''

  return (
    <div className={cn("rounded-xl border bg-card text-card-foreground shadow h-full flex flex-col", className)}>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h3 className="text-2xl font-bold">
              {value}
            </h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {(description ?? showTrend) && (
          <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
            {showTrend && TrendIcon && (
              <span className={cn("flex items-center font-medium", trendColor)}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {trendValue}%
                <span className="ml-1 hidden sm:inline">{t('vsLastMonth')}</span>
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

interface StatCardSkeletonProps {
  className?: string
}

export function StatCardSkeleton({ className }: StatCardSkeletonProps) {
  return (
    <div className={cn("rounded-xl border bg-card shadow h-full", className)}>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}
