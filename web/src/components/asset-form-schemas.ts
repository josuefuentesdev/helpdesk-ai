import { z } from "zod"
import { AssetStatus, AssetType } from "@prisma/client"

const createFormSchema = z.object({
  type: z.nativeEnum(AssetType),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  status: z.nativeEnum(AssetStatus),
})

const editFormSchema = z.object({
  type: z.nativeEnum(AssetType)
    .nullish(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  status: z.nativeEnum(AssetStatus)
    .nullish(),
})

export {
  editFormSchema,
  createFormSchema
}