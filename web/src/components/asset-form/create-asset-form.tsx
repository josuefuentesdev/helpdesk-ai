"use client"

import { AssetForm } from "@/components/asset-form/asset-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import { api } from "@/trpc/react"
import { type createFormSchema } from "./asset-form-schemas"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function CreateAssetForm() {
  const t = useTranslations('CreateAssetForm')
  const router = useRouter();

  const mutation = api.asset.create.useMutation({
    onSuccess: (data) => {
      toast.success(t('success'))
      router.push(`/assets/${data.id}`)
    },
    onError: (error) => {
      console.error("Error creating asset:", error)
      toast.error(t('error'))
    },
  })

  return (
    <AssetForm
      variant="create"
      onSubmit={function (values: z.infer<typeof createFormSchema>) {
        mutation.mutate({
          ...values,
        })
      }}
    />
  )
}