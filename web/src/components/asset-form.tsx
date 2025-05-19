"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { AssetType } from "@prisma/client"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { AssetTypeFormField } from "./asset-type-form-field"

const formSchema = z.object({
  type: z.nativeEnum(AssetType)
    .default(AssetType.OTHER)
    .nullish(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
})



export function AssetForm({
  asset,
}: {
  asset: AssetGetOne
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: asset.type,
      name: asset.name,
    },
  })

  const mutation = api.asset.updateOne.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating asset:", error)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      ...values,
      id: asset.id,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="black printer" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AssetTypeFormField control={form.control} name="type" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
