"use client"

import { AssetForm } from "@/components/asset-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import { api } from "@/trpc/react"
import { type createFormSchema } from "./asset-form-schemas"

export function CreateAssetForm() {
  const router = useRouter();

  const mutation = api.asset.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating asset:", error)
    },
  })

  return (
    <AssetForm
      asset={{
        name: "",
        type: "HARDWARE",
        status: "ACTIVE",
      }}
      onSubmit={function (values: z.infer<typeof createFormSchema>) {
        mutation.mutate({
          ...values,
        })
      }}
    />
  )
}