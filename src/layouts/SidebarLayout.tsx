import type { PropsWithChildren } from 'react';

import AppSidebar from '@/components/AppSideBar';
import { AppTopBar } from '@/components/AppTopBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const SidebarLayout = (props: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <AppTopBar />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  );
};
