"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth/AuthButton";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronRight, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname?.startsWith("/auth")) return null;

  const navItems = [
    { href: "/", label: "Journal" },
    { href: "/insights", label: "Insights" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="w-full sticky top-4 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between rounded-full bg-background/70 backdrop-blur-md border border-border/50 shadow px-4">
          {/* Logo + breadcrumb */}
          <div className="flex items-center space-x-2 relative">
            <Link
              href="/"
              className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hover:from-primary hover:to-secondary transition-colors"
            >
              Mindful Moments
            </Link>
            {pathname !== "/" && (
              <div className="absolute left-full ml-2 flex items-center space-x-1">
                <ChevronRight className="text-muted-foreground/60" size={14} />
                <span className="text-sm text-muted-foreground">
                  {navItems.find((item) => item.href === pathname)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
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

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-background/40"
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden mt-2 container mx-auto px-4">
          <nav className="flex flex-col rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors",
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
      )}
    </header>
  );
}
