import { z } from "zod"
import { AssetStatus, AssetType } from "@prisma/client"

export const baseFormSchema = z.object({
  type: z.nativeEnum(AssetType, {
    required_error: "Type is required.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  status: z.nativeEnum(AssetStatus, {
    required_error: "Status is required.",
  }),
  subtype: z.string().optional(),
  vendor: z.string().optional(),
  identifier: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseAt: z.date().optional(),
  warrantyExpiresAt: z.date().optional(),
  assignedToId: z.string().optional()
})

export const editFormSchema = baseFormSchema
export const createFormSchema = baseFormSchema

export type AssetFormValues = z.infer<typeof baseFormSchema>