"use client"

import { UserForm } from "@/components/user-form/user-form"
import { useRouter } from "next/navigation";
import { type z } from "zod"

import type { UserGetOne } from "@/types"
import { api } from "@/trpc/react"
import { type editFormSchema } from "./user-form-schemas"
import { toast } from "sonner"

export function EditUserForm({
  user,
}: {
  user: UserGetOne,
}) {
  const router = useRouter();

  const mutation = api.user.updateOne.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully")
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating user:", error)
      toast.error("Error updating user")
    },
  })

  return (
    <UserForm
      variant="edit"
      user={user}
      onSubmit={function (values: z.infer<typeof editFormSchema>) {
        mutation.mutate({
          ...values,
          id: user.id,
        })
      }}
    />
  )
}