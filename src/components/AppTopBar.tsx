'use client';

import * as React from 'react';

import { ModeToggle } from '@/components/ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppTopBar() {
  const topBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // wait until DOM has been loaded
    const mainElement = document.querySelector('main');
    const topBarElement = topBarRef.current;

    // if element exist，use ResizeObserver to observer the change of main element's size
    if (mainElement && topBarElement) {
      const resizeObserver = new ResizeObserver(() => {
        // get width of main element
        const mainWidth = mainElement.offsetWidth;

        // set the width of data-variant="top-bar" as same as the width of main element
        topBarElement.style.width = `${mainWidth}px`;
      });

      // start to observe
      resizeObserver.observe(mainElement);

      // Cleanup
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div
      ref={topBarRef}
      className="fixed top-0 right-0 h-16 z-50 pt-4 px-4 top-bar"
      data-variant="top-bar"
      data-slot="top-bar"
    >
      <div className="flex h-15 rounded-full border border-foreground/7 shadow-[rgba(31, 38, 135, 0.15) 0px 8px 32px] bg-foreground/1 w-full px-4 items-center justify-between align-between backdrop-blur-xl">
        <SidebarTrigger />
        <h2 className="font-bold">SHENGTONG JIN&apos;S BLOG</h2>
        <ModeToggle />
      </div>
    </div>
  );
}
