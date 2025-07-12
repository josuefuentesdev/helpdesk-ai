import { Locale } from "@prisma/client"
import { z } from "zod"

export const baseFormSchema = z.object({
  locale: z.nativeEnum(Locale, {
    required_error: "Locale is required.",
  }),
  departmentId: z.string().optional(),
  teamIds: z.array(z.string()).optional(),
})

export const editFormSchema = baseFormSchema

export type UserFormValues = z.infer<typeof baseFormSchema>