// Client-side script for sidebar functionality
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const MOBILE_BREAKPOINT = 768;

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function isMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function initSidebar(defaultOpen: boolean = true) {
  const sidebarWrapper = document.querySelector('[data-sidebar-wrapper]') as HTMLElement;
  const mobileSheet = document.querySelector('[data-mobile-sheet]') as HTMLElement;
  const mobileSheetOverlay = document.querySelector('[data-mobile-sheet-overlay]') as HTMLElement;
  const mobileSheetClose = document.querySelector('[data-mobile-sheet-close]') as HTMLElement;

  if (!sidebarWrapper) {
    console.warn('[Sidebar] Sidebar wrapper not found');
    return;
  }

  // Get initial state from cookie or use default
  const savedState = getCookie(SIDEBAR_COOKIE_NAME);
  let isOpen = savedState ? savedState === 'true' : defaultOpen;
  let isMobileOpen = false;

  function getSidebarElements() {
    return {
      sidebarGroup: document.querySelector('[data-sidebar]')?.closest('.group') as HTMLElement,
      sidebar: document.querySelector('[data-sidebar]') as HTMLElement,
      sidebarWrapper: sidebarWrapper,
    };
  }

  function updateSidebarState(open: boolean) {
    isOpen = open;
    setCookie(SIDEBAR_COOKIE_NAME, String(open), SIDEBAR_COOKIE_MAX_AGE);

    if (isMobile()) {
      // Mobile: use sheet
      if (mobileSheet) {
        const state = open ? 'open' : 'closed';
        mobileSheet.setAttribute('data-state', state);
        mobileSheet.style.display = state === 'open' ? 'block' : 'none';
        document.body.style.overflow = open ? 'hidden' : '';
      }
    } else {
      // Desktop: toggle sidebar
      const { sidebarGroup, sidebar, sidebarWrapper } = getSidebarElements();
      if (sidebarGroup) {
        sidebarGroup.setAttribute('data-state', open ? 'expanded' : 'collapsed');
      }
      if (sidebar) {
        sidebar.setAttribute('data-state', open ? 'expanded' : 'collapsed');
      }
      if (sidebarWrapper) {
        sidebarWrapper.setAttribute('data-state', open ? 'expanded' : 'collapsed');
      }
    }
  }

  function toggleSidebar() {
    if (isMobile()) {
      isMobileOpen = !isMobileOpen;
      updateSidebarState(isMobileOpen);
    } else {
      updateSidebarState(!isOpen);
    }
  }

  // Initialize state
  updateSidebarState(isOpen);

  // Handle all trigger buttons (there might be multiple)
  function setupTriggers() {
    const triggers = document.querySelectorAll('[data-sidebar-trigger]');
    triggers.forEach((trigger) => {
      // Remove existing listeners by cloning
      const newTrigger = trigger.cloneNode(true);
      trigger.parentNode?.replaceChild(newTrigger, trigger);

      newTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
      });
    });
  }

  // Setup triggers immediately and also after DOM is ready
  setupTriggers();

  // Also setup after a short delay to catch dynamically added triggers
  setTimeout(setupTriggers, 100);

  // Use event delegation for triggers added later
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-sidebar-trigger]')) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    }
  });

  // Handle mobile sheet overlay
  if (mobileSheetOverlay) {
    mobileSheetOverlay.addEventListener('click', () => {
      if (isMobile()) {
        isMobileOpen = false;
        updateSidebarState(false);
      }
    });
  }

  // Handle mobile sheet close button
  if (mobileSheetClose) {
    mobileSheetClose.addEventListener('click', () => {
      if (isMobile()) {
        isMobileOpen = false;
        updateSidebarState(false);
      }
    });
  }

  // Keyboard shortcut (Cmd/Ctrl + B)
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  // Handle window resize
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      updateSidebarState(isOpen);
    }, 100);
  });

  return {
    toggle: toggleSidebar,
    open: () => updateSidebarState(true),
    close: () => updateSidebarState(false),
  };
}
