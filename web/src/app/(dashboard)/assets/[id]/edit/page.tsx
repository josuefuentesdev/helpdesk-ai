import { notFound } from "next/navigation"
import { api } from "@/trpc/server"
import { EditAssetForm } from "@/components/edit-asset-form"

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const asset = await api.asset.getOne({
    id: id,
  })

  if (!asset) {
    notFound()
  }



  return (
    <div className="max-w-2xl px-6 py-8">
      <EditAssetForm asset={asset} />
    </div>
  )
}