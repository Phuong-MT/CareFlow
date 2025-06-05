"use client"
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
import { MenuSidebarUser } from "@/utils/menu"
export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useAppSelector(state => state.user)

  return (
      <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={MenuSidebarUser.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MenuSidebarUser.navMain} />
        <NavProjects projects={MenuSidebarUser.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MenuSidebarUser.user} role = 'user' />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    )
}