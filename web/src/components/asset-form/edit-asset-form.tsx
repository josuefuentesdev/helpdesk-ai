"use client"

import { AssetForm } from "@/components/asset-form/asset-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import type { AssetGetOne } from "@/types"
import { api } from "@/trpc/react"
import { type editFormSchema } from "./asset-form-schemas"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function EditAssetForm({
  asset,
}: {
  asset: AssetGetOne,
}) {
  const router = useRouter();
  const t = useTranslations("EditAssetForm");

  const mutation = api.asset.updateOne.useMutation({
    onSuccess: () => {
      toast.success(t("toast.success"))
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating asset:", error)
      toast.error(t("toast.error"))
    },
  })

  return (
    <AssetForm
      variant="edit"
      asset={asset}
      onSubmit={function (values: z.infer<typeof editFormSchema>) {
        mutation.mutate({
          ...values,
          id: asset.id,
        })
      }}
    />
  )
}