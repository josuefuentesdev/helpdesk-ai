import Image from 'next/image'
import { Icons } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const itemsData = [
  {
    key: "home",
    url: "/",
    icon: Icons.home,
  },
  {
    key: "tickets",
    url: "/tickets",
    icon: Icons.ticket,
  },
  {
    key: "assets",
    url: "/assets",
    icon: Icons.assets,
  },
  {
    key: "users",
    url: "/users",
    icon: Icons.user,
  }
]


export function AppSidebar() {
  const t = useTranslations('AppSidebar');
  const items = itemsData.map(item => ({
    ...item,
    title: t(`nav.${item.key}`)
  }))
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src="/helpdesk-ai.webp"
                  alt="helpdesk-ai logo"
                  width={32}
                  height={32}
                />
                <span className="text-base font-semibold">HelpdeskAi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button asChild size="sm" className="w-full mt-2">
              <Link href="/tickets/new" className="gap-2">
                <Icons.plus className="h-4 w-4" />
                {t('newTicket')}
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
