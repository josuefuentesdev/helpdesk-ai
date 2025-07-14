"use client"

import { notFound } from "next/navigation"
import { api } from "@/trpc/react"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export function EditUserProfile({
    userId,
}: {
    userId: string
}) {
  const { data: user, isPending, error } = api.user.getOne.useQuery({
    id: userId,
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    notFound()
  }

  return (
    <div className="max-w-2xl px-6 py-8">
      <ProfileEditForm user={user} />
    </div>
  )
}