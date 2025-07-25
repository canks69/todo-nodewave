"use client";

import * as React from "react";
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NavCollapsible, NavGroupProps, NavItem, NavLink } from './types'
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items) {
            const navLink = item as NavLink
            return <SidebarMenuLink key={item.title} item={navLink} />
          }

          if (state === 'collapsed' && !isMobile) {
            const navCollapsible = item as NavCollapsible
            return (
              <SidebarMenuCollapsedDropdown key={item.title} item={navCollapsible} />
            )
          }

          const navCollapsible = item as NavCollapsible
          return <SidebarMenuCollapsible key={item.title} item={navCollapsible} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: React.ReactNode }) => (
  <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuLink = ({ item }: { item: NavLink }) => {
  const currentPath = usePathname()
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={currentPath === item.url || currentPath.split('?')[0] === item.url}
        tooltip={item.title}
      >
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
}: {
  item: NavCollapsible
}) => {
  const { setOpenMobile } = useSidebar()
  const currentPath = usePathname()

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(currentPath, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const subItemKey = `${subItem.title}-${subItem.url}`
              
              return (
                <SidebarMenuSubItem key={subItemKey}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={currentPath === subItem.url || currentPath.split('?')[0] === subItem.url}
                  >
                    <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
}: {
  item: NavCollapsible
}) => {
  const currentPath = usePathname()
  
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(currentPath, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const subItemKey = `${sub.title}-${sub.url}`
            const isActive = currentPath === sub.url || currentPath.split('?')[0] === sub.url
            
            return (
              <DropdownMenuItem key={subItemKey} asChild>
                <Link
                  href={sub.url}
                  className={`${isActive ? 'bg-secondary' : ''}`}
                >
                  {sub.icon && <sub.icon />}
                  <span className='max-w-52 text-wrap'>{sub.title}</span>
                  {sub.badge && (
                    <span className='ml-auto text-xs'>{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  if ('url' in item && item.url) {
    return (
      href === item.url || // /endpoint?search=param
      href.split('?')[0] === item.url || // endpoint
      (mainNav &&
        href.split('/')[1] !== '' &&
        item.url.split('/')[1] !== '' &&
        href.split('/')[1] === item.url.split('/')[1])
    )
  }

  if (item.items && item.items.length > 0) {
    return !!item.items.some(subItem => 
      subItem.url === href || 
      href.split('?')[0] === subItem.url
    )
  }
  
  // Default case
  return false
}