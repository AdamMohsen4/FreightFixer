import * as React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Package, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { FreightLogo } from "./FreightLogo";
import { NavMain } from "./NavMain";
import { SettingsDialog } from "./SettingsDialog";

const data = {
  navItems: [
    {
      title: "Shipments",
      url: "/shipments",
      icon: Package,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathname = location.pathname;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const navItems = React.useMemo(
    () =>
      data.navItems.map((item) => ({
        ...item,
        isActive:
          pathname === item.url ||
          pathname.startsWith(`${item.url}/`) ||
          (pathname === "/" && item.url === "/shipments"),
      })),
    [pathname]
  );

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className="py-3">
                <Link to="/">
                  <FreightLogo size={32} iconOnly={isCollapsed} />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SettingsDialog>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SettingsDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <Outlet />
    </>
  );
}
