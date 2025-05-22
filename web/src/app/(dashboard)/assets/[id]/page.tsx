import { notFound } from "next/navigation"
import { AssetForm } from "@/components/asset-form"
import { api } from "@/trpc/server"

export default async function AssetPage({
  params,
}: {
  params: { id: string }
}) {
  const asset = await api.asset.getOne({
    id: params.id,
  })

  if (!asset) {
    notFound()
  }

  return (
    <div className="max-w-2xl px-6 py-8">
      <AssetForm asset={asset} disabled={true} />
    </div>
  )
}