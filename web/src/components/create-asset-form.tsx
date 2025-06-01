"use client"

import { AssetForm } from "@/components/asset-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import { api } from "@/trpc/react"
import { type createFormSchema } from "./asset-form-schemas"
import { toast } from "sonner"

export function CreateAssetForm() {
  const router = useRouter();

  const mutation = api.asset.create.useMutation({
    onSuccess: (data) => {
      toast.success("Asset created successfully")
      router.push(`/assets/${data.id}`)
    },
    onError: (error) => {
      console.error("Error creating asset:", error)
      toast.error("Error creating asset")
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