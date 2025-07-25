interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: string
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroupProps {
  title: string
  items: NavItem[]
}

interface SidebarData {
  navGroups: NavGroupProps[]
}

export type { SidebarData, NavGroupProps, NavItem, NavCollapsible, NavLink }
