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
import { Icons } from "@/components/icons"
import type { AssetGetOne } from "@/types"
import { AssetTypeFormField } from "./asset-type-form-field"
import { AssetStatusFormField } from "./asset-status-form-field"
import { type editFormSchema, type createFormSchema } from "./asset-form-schemas"
import { useTranslations } from "next-intl"


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

  const intl = useTranslations("AssetForm")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {asset?.id ? intl('title.edit') : intl('title.create')}
            </h2>
            <p className="text-muted-foreground">
              {asset?.id ? intl('description.edit') : intl('description.create')}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icons.assets className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="border-t border-border/40 my-4" />
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    {intl('form.name.label')}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={intl('form.name.placeholder')}
                      className="bg-background/50"
                      {...field} 
                      disabled={disabled} 
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground/70">
                    {intl('form.name.description')}
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AssetTypeFormField 
                control={form.control} 
                name="type" 
                disabled={disabled} 
              />
              <AssetStatusFormField 
                control={form.control} 
                name="status" 
                disabled={disabled} 
              />
            </div>
          </div>
          
          {!disabled && (
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="min-w-[120px]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-background border-t-2 border-t-primary rounded-full animate-spin" />
                    {asset?.id ? intl('form.submit.updating') : intl('form.submit.creating')}
                  </>
                ) : asset?.id ? intl('form.submit.update') : intl('form.submit.create')}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
