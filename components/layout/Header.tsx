"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth/AuthButton";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronRight, Menu, X } from "lucide-react";

/**
 * The Header component serves as the main navigation bar for the application.
 * Features improved responsive design and better mobile UX.
 */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Do not render the header on authentication pages.
  if (pathname?.startsWith("/auth")) return null;

  const navItems = [
    { href: "/", label: "Journal" },
    { href: "/insights", label: "Insights" },
    { href: "/settings", label: "Settings" },
  ];

  const currentPageLabel = navItems.find(
    (item) => item.href === pathname
  )?.label;

  return (
    <header className="w-full sticky top-4 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between rounded-full bg-background/70 backdrop-blur-md border border-border/50 shadow px-6">
          {/* Logo and breadcrumb section */}
          <div className="flex items-center space-x-3 min-w-0 flex-1 ">
            <Link
              href="/"
              className="text-lg font-bold text-foreground hover:text-primary transition-colors duration-300"
            >
              Mindful Moments
            </Link>

            {/* Breadcrumb for current page */}
            {pathname !== "/" && currentPageLabel && (
              <div className="hidden sm:flex items-center space-x-2 text-muted-foreground">
                <ChevronRight size={14} />
                <span className="text-sm">{currentPageLabel}</span>
              </div>
            )}
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-2 mr-4">
            <nav className="flex items-center space-x-1 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
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
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <AuthButton />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-full hover:bg-background/40 transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 container mx-auto px-4 absolute left-0 right-0">
          <nav className="flex flex-col rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow p-2 space-y-2">
            {/* Navigation items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg transition-colors text-base",
                  pathname === item.href
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Settings section */}
            <div className="border-t border-border/50 pt-3 space-y-3 flex justify-between items-center px-4">
              <ThemeToggle />

              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
