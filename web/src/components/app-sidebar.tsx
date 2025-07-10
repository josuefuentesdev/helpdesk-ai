import { Icons } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('application')}</SidebarGroupLabel>
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
