
import { AssetDataTable } from "@/components/asset-table/asset-data-table"
import { api } from "@/trpc/server"

export default async function AssetsPage() {
  const assets = await api.asset.getAll()
  return (
    <AssetDataTable data={assets} />
  )
}