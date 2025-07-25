"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { ProfileDropdown } from './profile-dropdown'

interface HeaderWithoutSidebarProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const HeaderWithoutSidebar = ({
  className,
  fixed,
  ...props
}: HeaderWithoutSidebarProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'bg-background flex h-16 items-center gap-3 p-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div className='text-xl font-semibold'>
        Nodewave
      </div>
      <div className='ml-auto flex items-center space-x-4'>
        <ProfileDropdown />
      </div>
    </header>
  )
}

HeaderWithoutSidebar.displayName = 'HeaderWithoutSidebar'
