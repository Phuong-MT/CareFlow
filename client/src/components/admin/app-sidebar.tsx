"use client"
import { MenuSidebar , MenuSidebarPoc} from '../../utils/menu'

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
import {useState} from "react"
import { useAppSelector } from '@/hooks/config'
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useAppSelector(state => state.user)
  const [userRole, setUserRole] = useState(user?.role)

  return (
    userRole === "admin" || userRole === "super_admin" ?(
      <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={MenuSidebar.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MenuSidebar.navMain} />
        <NavProjects projects={MenuSidebar.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MenuSidebar.user} role = {userRole} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    )
    :(
      <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={MenuSidebarPoc.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MenuSidebarPoc.navMain} />
        <NavProjects projects={MenuSidebarPoc.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MenuSidebarPoc.user} role = {userRole}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    )
  )
}