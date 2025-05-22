"use client"

import { AssetForm } from "@/components/asset-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import type { AssetGetOne } from "@/types"
import { api } from "@/trpc/react"
import { type editFormSchema } from "./asset-form-schemas"

export function EditAssetForm({
  asset,
}: {
  asset: AssetGetOne,
}) {
  const router = useRouter();

  const mutation = api.asset.updateOne.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating asset:", error)
    },
  })

  return (
    <AssetForm
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