
import { AssetDataTable } from "@/components/asset-table/asset-data-table"
import { api } from "@/trpc/server"

export default async function AssetsPage() {
  const assets = await api.asset.getAll()
  return (
    <div className="hidden h-full flex-1 flex-col p-4 md:flex">
      <AssetDataTable data={assets} />
    </div>
  )
}