import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Home,
  Send,
  ArrowDownToLine,
  TableProperties,
  Import,
  CloudUpload,
  LogOut,
} from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useSetAtom } from "jotai"
import { activeWalletAtom } from "@/atoms/activeWalletAtom"

const homeItems = [
  { title: "Account", icon: Home, to: "/account" },
  { title: "Send", icon: Send, to: "/send" },
  { title: "Receive", icon: ArrowDownToLine, to: "/receive" },
  { title: "Activity", icon: TableProperties, to: "/activity"}
]

const settingsItems = [
  { title: "Import", icon: Import, to: "/import" },
  { title: "Export", icon: CloudUpload, to: "/export" },
]

export function AppSidebar() {
  const setActiveWallet = useSetAtom(activeWalletAtom)
  const navigate = useNavigate()

  function handleLogout() {
    setActiveWallet(null)
    navigate({ to: '/' })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <img src="/unitmetal-symbol.svg" alt="UnitMetal" className="h-6 w-6 dark:invert" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link to={item.to} />}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link to={item.to} />}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
