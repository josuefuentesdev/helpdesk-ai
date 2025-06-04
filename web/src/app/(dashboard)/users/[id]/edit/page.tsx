import { notFound } from "next/navigation"
import { api } from "@/trpc/server"
import { EditUserForm } from "@/components/user-form/edit-user-form"

export default async function EditUserPage({
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
      <EditUserForm user={user} />
    </div>
  )
}