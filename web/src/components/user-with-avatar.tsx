import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/react"
import { UserAvatar } from "@/components/user-avatar"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface UserWithAvatarProps {
  userId: string
  className?: string
}

export function UserWithAvatar({ userId, className }: UserWithAvatarProps) {
  const { data: user, isPending, error } = api.user.getOneAvatar.useQuery({ id: userId })
  const t = useTranslations('UserWithAvatar')

  if (isPending) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <UserAvatar
          user={{ name: t('error'), image: null }}
          className="h-8 w-8"
        />
        <span className="text-sm font-medium text-red-500">{t('error')}</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <UserAvatar
          user={{ name: t('unknown'), image: null }}
          className="h-8 w-8"
        />
        <span className="text-sm font-medium text-muted-foreground">{t('unknown')}</span>
      </div>
    )
  }


  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <UserAvatar
        user={{
          name: user.name,
          image: user.image,
        }}
        className="h-8 w-8"
      />
      <span className="text-sm font-medium">{user.name}</span>
    </div>
  )
}
