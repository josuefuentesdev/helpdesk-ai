"use client"

import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { AssetGetOne } from "@/types"
import { AssetTypeFormField } from "./asset-type-form-field"
import { AssetStatusFormField } from "./asset-status-form-field"
import { type editFormSchema, type createFormSchema } from "./asset-form-schemas"


type createEditFormSchema = z.infer<typeof createFormSchema> & z.infer<typeof editFormSchema>

export function AssetForm({
  asset,
  onSubmit,
  disabled = false,
}: {
  asset?: Partial<AssetGetOne> | null,
  onSubmit?: (values: createEditFormSchema) => void,
  disabled?: boolean,
}) {
  const form = useForm<createEditFormSchema>({
    defaultValues: {
      ...asset,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="black printer" {...field} disabled={disabled} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AssetTypeFormField control={form.control} name="type" disabled={disabled} />
        <AssetStatusFormField control={form.control} name="status" disabled={disabled} />
        {!disabled && <Button type="submit">Submit</Button>}
      </form>
    </Form>
  )
}
