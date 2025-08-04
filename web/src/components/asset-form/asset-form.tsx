"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { AssetDateFormField } from "@/components/asset-date-form-field"
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
import { useTranslations } from "next-intl"
import Link from "next/link"
import { AssetTypeFormField } from "@/components/asset-type-form-field"
import { AssetStatusFormField } from "@/components/asset-status-form-field"
import { baseFormSchema, type AssetFormValues } from "./asset-form-schemas"
import { UserFormField } from "@/components/user-form-field"
import { AuditFieldsDisplay } from "@/components/audit-fields-display"
import { AssetImageUpload } from "@/components/asset-image-upload"


type AssetFormProps =
  | {
    variant: "view";
    asset: AssetGetOne;
    onSubmit?: never;
  }
  | {
    variant: "edit";
    asset: AssetGetOne;
    onSubmit: (values: AssetFormValues) => void;
  }
  | {
    variant: "create";
    asset?: never;
    onSubmit: (values: AssetFormValues) => void;
  };

export function AssetForm({
  asset,
  variant,
  onSubmit,
}: AssetFormProps) {
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      type: asset?.type ?? undefined,
      name: asset?.name ?? "",
      status: asset?.status ?? undefined,
      subtype: asset?.subtype ?? "",
      vendor: asset?.vendor ?? "",
      identifier: asset?.identifier ?? "",
      model: asset?.model ?? "",
      serialNumber: asset?.serialNumber ?? "",
      purchaseAt: asset?.purchaseAt ?? undefined,
      warrantyExpiresAt: asset?.warrantyExpiresAt ?? undefined,
      assignedToId: asset?.assignedToId ?? undefined,
      image: asset?.image ?? undefined,
    },
  })

  const t = useTranslations("AssetForm")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`title.${variant}`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`description.${variant}`)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {variant === "view" && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/assets/${asset.id}/edit`} className="flex items-center">
                  <Icons.edit className="mr-2 h-4 w-4" />
                  {t('actions.edit')}
                </Link>
              </Button>
            )}
            <div className="rounded-lg bg-primary/10 p-3">
              <Icons.assets className="h-6 w-6 text-primary" />
            </div>
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
                    {t('form.name.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.name.placeholder')}
                      className="bg-background/50"
                      {...field}
                      disabled={variant === "view"}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground/70">
                    {t('form.name.description')}
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AssetImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={variant === "view"}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AssetTypeFormField
                control={form.control}
                name="type"
                disabled={variant === "view"}
              />
              <AssetStatusFormField
                control={form.control}
                name="status"
                disabled={variant === "view"}
              />
              <FormField
                control={form.control}
                name="subtype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t('form.subtype.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.subtype.placeholder')}
                        className="bg-background/50"
                        {...field}
                        disabled={variant === "view"}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      {t('form.subtype.description')}
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t('form.vendor.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.vendor.placeholder')}
                        className="bg-background/50"
                        {...field}
                        disabled={variant === "view"}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      {t('form.vendor.description')}
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t('form.identifier.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.identifier.placeholder')}
                        className="bg-background/50"
                        {...field}
                        disabled={variant === "view"}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      {t('form.identifier.description')}
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t('form.model.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.model.placeholder')}
                        className="bg-background/50"
                        {...field}
                        disabled={variant === "view"}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      {t('form.model.description')}
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t('form.serialNumber.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.serialNumber.placeholder')}
                        className="bg-background/50"
                        {...field}
                        disabled={variant === "view"}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground/70">
                      {t('form.serialNumber.description')}
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <AssetDateFormField
                control={form.control}
                name="purchaseAt"
                label={t('form.purchaseAt.label')}
                placeholder={t('form.purchaseAt.placeholder')}
                description={t('form.purchaseAt.description')}
                disabled={variant === "view"}
              />
              <AssetDateFormField
                control={form.control}
                name="warrantyExpiresAt"
                label={t('form.warrantyExpiresAt.label')}
                placeholder={t('form.warrantyExpiresAt.placeholder')}
                description={t('form.warrantyExpiresAt.description')}
                disabled={variant === "view"}
              />
              <UserFormField
                control={form.control}
                name="assignedToId"
                disabled={variant === "view"}
              />
            </div>
          </div>

          {(variant === "view" || variant === "edit") && asset && (
            <AuditFieldsDisplay
              createdById={asset.createdById}
              createdAt={asset.createdAt}
              updatedAt={asset.updatedAt}
              updatedById={asset.updatedById}
            />
          )}

          {(variant === "edit" || variant === "create") && (
            <div className="flex justify-end pt-4">
              <Button type="submit" className="min-w-[120px]">
                {form.formState.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-background border-t-2 border-t-primary rounded-full animate-spin" />
                    {t(`form.submit.loading.${variant}`)}
                  </>
                ) : t(`form.submit.${variant}`)}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
