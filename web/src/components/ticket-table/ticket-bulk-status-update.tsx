"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TicketStatus } from "@prisma/client"
import { TicketStatusBadge } from "./ticket-status-badge"
import { Icons } from "@/components/icons"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TicketBulkStatusUpdateProps {
  selectedTicketIds: string[]
  onSuccess?: () => void
}

export function TicketBulkStatusUpdate({
  selectedTicketIds,
  onSuccess,
}: TicketBulkStatusUpdateProps) {
  const t = useTranslations("TicketBulkStatusUpdate")
  const tTicketStatus = useTranslations("TicketStatus")
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const updateStatusMutation = api.ticket.updateStatusBulk.useMutation({
    onSuccess: () => {
      toast.success(t("statusUpdateSuccess", { count: selectedTicketIds.length }))
      setIsOpen(false)
      onSuccess?.()
      router.refresh()
    },
    onError: (error) => {
      toast.error(t("statusUpdateError", { error: error.message }))
    },
  })

  const handleStatusUpdate = (status: TicketStatus) => {
    updateStatusMutation.mutate({
      ticketIds: selectedTicketIds,
      status,
    })
  }

  if (selectedTicketIds.length === 0) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Icons.edit className="mr-2 h-4 w-4" />
          {t("updateStatus", { count: selectedTicketIds.length })}
          <Icons.chevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(TicketStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
            disabled={updateStatusMutation.isPending}
          >
            <TicketStatusBadge status={status} />
            <span className="ml-2">{tTicketStatus(status)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}