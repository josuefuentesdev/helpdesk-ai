import { UserDataTable } from "@/components/user-table/user-data-table"
import { api } from "@/trpc/server"
import { PageLayout } from "@/components/page-layout"
import { getTranslations } from "next-intl/server"

export default async function UsersPage() {
  const t = await getTranslations('UsersPage')
  const users = await api.user.getAll()
  return (
    <PageLayout
      title={t('title')}
    >
      <UserDataTable
        data={users}
        className="h-[calc(100vh-var(--header-height)-6rem)]"
        initialColumnVisibility={{
          id: false,
        }}
      />
    </PageLayout>
  )
}