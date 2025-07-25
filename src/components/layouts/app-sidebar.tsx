"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { HomeIcon} from "lucide-react";
import Link from "next/link";
import {NavGroup} from "@/components/layouts/nav-group";
import {NavGroupProps} from "@/components/layouts/types";

const navGroups: NavGroupProps[] = [
  {
    title: 'Main',
    items: [
      {
        title: 'To do',
        url: '/',
        icon: HomeIcon,
      },
    ]
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={'/'}>
                <div className='flex flex-col gap-0.5 leading-none text-2xl font-semibold'>
                  Nodewave
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}