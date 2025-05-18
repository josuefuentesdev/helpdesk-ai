import { AssetDataTable } from "@/components/asset-table/asset-data-table"
import { api } from "@/trpc/server"

export default async function AssetsPage() {
  const assets = await api.asset.getAll()
  return (
    // 2rem is because of the padding on the page
    <AssetDataTable data={assets} className="h-[calc(100vh-var(--header-height)-2rem)]" />
  )
}