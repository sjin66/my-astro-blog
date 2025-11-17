import type { PropsWithChildren } from 'react';

import AppSidebar from '@/components/AppSideBar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const SidebarLayout = (props: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">{props.children}</SidebarInset>
      <SidebarProvider />
    </SidebarProvider>
  );
};
