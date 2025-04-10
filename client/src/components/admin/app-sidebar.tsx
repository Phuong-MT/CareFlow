"use client"
import { MenuSidebar } from '../../utils/menu'

import * as React from "react"
import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavUser } from "@/components/admin/nav-user"
import { TeamSwitcher } from "@/components/admin/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={MenuSidebar.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MenuSidebar.navMain} />
        <NavProjects projects={MenuSidebar.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MenuSidebar.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}