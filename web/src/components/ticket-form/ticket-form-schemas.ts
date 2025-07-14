import { z } from "zod"
import { TicketPriority, TicketStatus } from "@prisma/client"

export const baseFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  priority: z.nativeEnum(TicketPriority, {
    required_error: "Priority is required.",
  }),
  status: z.nativeEnum(TicketStatus, {
    required_error: "Status is required.",
  }),
  dueAt: z.date().nullable().optional(),
  agentId: z.string().cuid({ message: "Invalid user ID."}).nullable().optional(),
  teamId: z.string().cuid({ message: "Invalid team ID."}).nullable().optional(),
})

export const editFormSchema = baseFormSchema
export const createFormSchema = baseFormSchema

export type TicketFormValues = z.infer<typeof baseFormSchema>
