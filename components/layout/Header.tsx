'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AuthButton } from '@/components/auth/AuthButton';
import { ThemeToggle } from './ThemeToggle';
import { ChevronRight, Menu, X } from 'lucide-react';

/**
 * The Header component serves as the main navigation bar for the application.
 * Features improved responsive design and better mobile UX.
 */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Do not render the header on authentication pages.
  if (pathname?.startsWith('/auth')) return null;

  const navItems = [
    { href: '/', label: 'Journal' },
    { href: '/insights', label: 'Insights' },
    { href: '/settings', label: 'Settings' },
  ];

  const currentPageLabel = navItems.find(
    (item) => item.href === pathname,
  )?.label;

  return (
    <header className="sticky top-4 z-40 w-full">
      <div className="container mx-auto px-4">
        <div className="bg-background/70 border-border/50 flex h-16 items-center justify-between rounded-full border px-6 shadow backdrop-blur-md">
          {/* Logo and breadcrumb section */}
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <Link
              href="/"
              className="text-foreground hover:text-primary text-lg font-bold transition-colors duration-300"
            >
              Mindful Moments
            </Link>

            {/* Breadcrumb for current page */}
            {pathname !== '/' && currentPageLabel && (
              <div className="text-muted-foreground hidden items-center space-x-2 sm:flex">
                <ChevronRight size={14} />
                <span className="text-sm">{currentPageLabel}</span>
              </div>
            )}
          </div>

          {/* Desktop navigation */}
          <div className="mr-4 hidden items-center gap-2 lg:flex">
            <nav className="flex items-center space-x-1 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 transition-colors',
                    pathname === item.href
                      ? 'bg-primary/10 text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2">
            {/* Theme toggle and auth - desktop only */}
            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="hover:bg-background/40 rounded-full p-2 transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileOpen && (
        <div className="absolute right-0 left-0 container mx-auto mt-2 px-4 lg:hidden">
          <nav className="bg-background/80 border-border/50 flex flex-col space-y-2 rounded-2xl border p-2 shadow backdrop-blur-md">
            {/* Navigation items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2 text-base transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40',
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Settings section */}
            <div className="border-border/50 flex items-center justify-between space-y-3 border-t px-4 pt-3">
              <ThemeToggle />

              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
