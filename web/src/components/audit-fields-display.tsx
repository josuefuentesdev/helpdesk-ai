import { format } from "date-fns"
import { UserWithAvatar } from "@/components/user-with-avatar"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Icons } from "@/components/icons"
import { Clock, Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface AuditFieldsProps {
  createdById: string
  createdAt: Date
  updatedAt?: Date | null
  updatedById?: string | null
  className?: string
}

export function AuditFieldsDisplay({
  createdById,
  createdAt,
  updatedAt,
  updatedById,
  className,
}: AuditFieldsProps) {
  const t = useTranslations('AuditFields')

  return (
    <TooltipProvider>
      <div className={cn("rounded-lg border border-border/60 bg-card/30 p-4", className)}>
        <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {t('auditTitle')}
        </h4>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Created information */}
          <div className="flex flex-col space-y-2 rounded-md bg-background/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Icons.user className="h-3 w-3" />
                {t('createdBy')}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-help">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(createdAt), 'MMM d, yyyy')}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">{format(new Date(createdAt), 'PPP p')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <UserWithAvatar userId={createdById} className="mt-1" />
          </div>

          {updatedById && updatedAt && (
            <div className="flex flex-col space-y-2 rounded-md bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Icons.user className="h-3 w-3" />
                  {t('updatedBy')}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-help">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(updatedAt), 'MMM d, yyyy')}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{format(new Date(updatedAt), 'PPP p')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <UserWithAvatar userId={updatedById} className="mt-1" />
            </div>
          )}
          
          {(!updatedById || !updatedAt) && (
            <div className="flex flex-col justify-center items-center space-y-2 rounded-md bg-background/30 p-3 border border-dashed border-border/40">
              <span className="text-xs text-muted-foreground">{t('noUpdates')}</span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
