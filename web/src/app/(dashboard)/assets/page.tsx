import { AssetDataTable } from "@/components/asset-table/asset-data-table"
import { api } from "@/trpc/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"

export default async function AssetsPage() {
  const assets = await api.asset.getAll()
  return (
    <PageLayout
      title="Assets"
      actions={
        <Button asChild>
          <Link href="/assets/new">New Asset</Link>
        </Button>
      }
    >
      <AssetDataTable
        data={assets}
        className="h-[calc(100vh-var(--header-height)-6rem)]"
        initialColumnVisibility={{
          id: false,
          serialNumber: false,
          purchaseDate: false,
          purchasePrice: false,
          currency: false,
          warrantyExpires: false,
          createdAt: false,
          updatedAt: false,
        }}
      />
    </PageLayout>
  )
}