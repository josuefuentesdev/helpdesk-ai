"use client"

import { AssetForm } from "@/components/asset-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import { api } from "@/trpc/react"
import { type createFormSchema } from "./asset-form-schemas"

export function CreateAssetForm() {
  const router = useRouter();

  const mutation = api.asset.create.useMutation({
    onSuccess: (data) => {
      router.push(`/assets/${data.id}`)
    },
    onError: (error) => {
      console.error("Error creating asset:", error)
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