import { notFound } from "next/navigation"
import { AssetForm } from "@/components/asset-form"
import { api } from "@/trpc/server"

export default async function AssetPage({
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
      <AssetForm asset={asset} variant="view"/>
    </div>
  )
}