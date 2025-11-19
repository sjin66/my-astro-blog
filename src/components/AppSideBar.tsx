'use client';

import * as React from 'react';

import selfie from '@/assets/self.jpeg';
import { ModeToggle } from '@/components/ModeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type NavigateItemProps = {
  href: string;
  label: string;
};

const FOOTER_ICON_COLOR = 'gray' as const;

const NavigateItem = ({ href, label }: NavigateItemProps) => {
  // get path from window location
  const [path, setPath] = React.useState('/');
  const baseUrl = import.meta.env.BASE_URL;

  React.useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  // Build full href with base URL
  // Ensure proper path joining: baseUrl + '/' + href (without leading slash)
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  const fullHref = href === '/' ? normalizedBase || '/' : `${normalizedBase}${normalizedHref}`;

  // More precise active state checking
  // For home page (/), only match exactly or with a trailing slash
  // For other pages, match exactly or as a prefix (for nested routes)
  const isActive =
    href === '/'
      ? path === normalizedBase || path === `${normalizedBase}/`
      : path === fullHref || path.startsWith(`${fullHref}/`);

  return (
    <li>
      <a
        href={fullHref}
        className={`font-bold font-mono text-base transition-colors hover:text-sidebar-primary ${isActive ? 'text-sidebar-primary' : 'text-muted-foreground'}`}
      >
        {label}
      </a>
    </li>
  );
};

interface SVGLinkIconProps {
  href: string;
  svgPath: string;
  viewBox?: string;
  label: string;
}

const SVGLinkIcon = ({ href, svgPath, viewBox = '0 0 512 512', label }: SVGLinkIconProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        <svg
          role="img"
          viewBox={viewBox}
          width={'25px'}
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`social media ${label}`}
        >
          <path fill={FOOTER_ICON_COLOR} d={svgPath} />
        </svg>
      </a>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
);

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-col items-center justify-center mt-30 ">
          <img
            src={selfie.src}
            alt="Selfie"
            className="h-16 w-16 rounded-full border-2 border-sidebar-ring shadow-md shadow-sidebar-ring"
          />
          <h1 className="mt-10 text-2xl font-bold font-fjalla text-foreground">SHENGTONG JIN</h1>
          <ul className="flex flex-col items-center space-y-8 mt-30">
            <NavigateItem href="/" label="HOME" />
            <NavigateItem href="/about" label="ABOUT ME" />
            <NavigateItem href="/experience" label="EXPERIENCE" />
            <NavigateItem href="/projects" label="PROJECTS" />
            <NavigateItem href="/blog" label="BLOGS" />
          </ul>
        </div>
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center mb-20">
        <div className="flex gap-4">
          <SVGLinkIcon
            label="Juejin"
            href="https://juejin.cn/user/3653016850800692"
            svgPath="m12 14.316 7.454-5.88-2.022-1.625L12 11.1l-.004.003-5.432-4.288-2.02 1.624 7.452 5.88Zm0-7.247 2.89-2.298L12 2.453l-.004-.005-2.884 2.318 2.884 2.3Zm0 11.266-.005.002-9.975-7.87L0 12.088l.194.156 11.803 9.308 7.463-5.885L24 12.085l-2.023-1.624Z"
            viewBox="0 0 24 24"
          />
          <SVGLinkIcon
            label="GitHub"
            href=""
            svgPath="M173.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM252.8 8c-138.7 0-244.8 105.3-244.8 244 0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1 100-33.2 167.8-128.1 167.8-239 0-138.7-112.5-244-251.2-244zM105.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
          />
          <SVGLinkIcon
            label="LinkedIn"
            href=""
            svgPath="M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z"
          />
          <SVGLinkIcon
            label="Email"
            href=""
            svgPath="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"
          />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
