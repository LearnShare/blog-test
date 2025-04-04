import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import menus from '@/router/menus';;

export function SideNav() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 flex gap-2 items-center">
          <h1 className="text-2xl font-semibold">BLOG</h1>
          <span className="text-sm text-slate-600">管理后台</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-8 gap-0">
        {
          menus.map((group) => (
            <SidebarGroup
                key={ group.name }>
              {
                group.label && (
                  <SidebarGroupLabel>{ group.label }</SidebarGroupLabel>
                )
              }
              <SidebarGroupContent>
                <SidebarMenu>
                  {
                    group.menus.map((menu) => (
                      <SidebarMenuItem
                          key={ menu.name }>
                        <SidebarMenuButton asChild>
                          <a
                              className="cursor-pointer select-none h-auto hover:bg-white"
                              href={ menu.path }>
                            {
                              menu.icon && (
                                <menu.icon />
                              )
                            }
                            <span>{ menu.label }</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  }
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        }
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
