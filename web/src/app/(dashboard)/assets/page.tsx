import { AssetDataTable } from "@/components/asset-table/asset-data-table"
import { api } from "@/trpc/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { getTranslations } from "next-intl/server"

export default async function AssetsPage() {
  const t = await getTranslations('AssetsPage')
  const assets = await api.asset.getAll()
  return (
    <PageLayout
      title={t('title')}
      actions={
        <Button asChild>
          <Link href="/assets/new">{t('newAsset')}</Link>
        </Button>
      }
    >
      <AssetDataTable
        data={assets}
        className="h-[calc(100vh-var(--header-height)-6rem)]"
        initialColumnVisibility={{
          id: false,
          serialNumber: false,
          purchaseAt: false,
          warrantyExpiresAt: false,
          createdAt: false,
          updatedAt: false,
        }}
      />
    </PageLayout>
  )
}