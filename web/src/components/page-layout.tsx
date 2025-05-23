"use client"

import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  children?: ReactNode
}

function PageHeader({ title, children, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex justify-between items-center", className)} {...props}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  actions?: ReactNode
  children: ReactNode
}

function PageLayout({ title, actions, children, className, ...props }: PageProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <PageHeader title={title}>{actions}</PageHeader>
      {children}
    </div>
  )
}

export { PageLayout }
