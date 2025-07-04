import { notFound } from "next/navigation"
import { UserForm } from "@/components/user-form/user-form"
import { api } from "@/trpc/server"

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await api.user.getOne({
    id: id,
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="max-w-2xl px-6 py-8">
      <UserForm user={user} variant="view"/>
    </div>
  )
}