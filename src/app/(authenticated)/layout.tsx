"use client";

import {AppSidebar} from "@/components/layouts/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Header} from "@/components/layouts/header";
import {HeaderWithoutSidebar} from "@/components/layouts/header-without-sidebar";
import { LogoutDialog } from "@/components/logout";
import { cn } from "@/lib/utils";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { AuthGuard } from "@/components/auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <LayoutContent>{children}</LayoutContent>
    </AuthGuard>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuthHydration();

  const showSidebar = user?.role === "ADMIN";

  if (showSidebar) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}>
          <Header/>
          <div className={cn(
            'peer-[.header-fixed]/header:mt-16 h-screen overflow-y-auto',
            'px-4 py-6',
          )}>
            {children}
          </div>
        </SidebarInset>
        <LogoutDialog/>
      </SidebarProvider>
    );
  }
  return (
    <div className="flex h-svh flex-col">
      <HeaderWithoutSidebar/>
      <div className={cn(
        'peer-[.header-fixed]/header:mt-16 h-screen overflow-y-auto',
        'px-4 py-6',
      )}>
        {children}
      </div>
      <LogoutDialog/>
    </div>
  );
}