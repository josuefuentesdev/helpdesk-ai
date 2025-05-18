import { redirect } from "next/navigation"
import { auth } from "@/server/auth"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <BreadcrumbNav />
          <div className="flex-1" />
          <ModeToggle />
          <UserAccountNav user={session.user} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
