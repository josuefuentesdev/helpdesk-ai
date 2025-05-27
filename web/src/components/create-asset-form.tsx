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
      asset={{
        id: "",
        name: "",
        type: "HARDWARE",
        status: "ACTIVE",
        model: null,
        subtype: null,
        vendor: null,
        identifier: null,
        serialNumber: null,
        purchaseDate: null,
        warrantyExpires: null,
        assignedToId: null,
      }}
      onSubmit={function (values: z.infer<typeof createFormSchema>) {
        mutation.mutate({
          ...values,
        })
      }}
    />
  )
}