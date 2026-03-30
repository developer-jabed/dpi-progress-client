"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import LogoutButton from "./LogoutButton";
import { getCookie } from "@/service/auth/tokenHandlers";

// ─── Nav items ────────────────────────────────────────────────────────────────

const BASE_NAV = [
  { href: "/", label: "Home" },

];

// ─── Component ────────────────────────────────────────────────────────────────

const PublicNavbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // ── Auth check ──────────────────────────────────────────────────────────
  useEffect(() => {
    getCookie("accessToken").then((token) => setIsLoggedIn(!!token));
  }, []);

  // ── Scroll behaviour: shadow + hide-on-scroll-down ──────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setVisible(y < lastScrollY.current || y < 60);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    ...BASE_NAV,
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-transparent",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex items-center gap-2 shrink-0"
          >
      
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rotate-45 rounded-sm bg-zinc-900 dark:bg-white transition-transform duration-300 group-hover:rotate-[135deg]" />
              <span className="relative z-10 h-2 w-2 rounded-full bg-white dark:bg-zinc-900" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
              Brothers<span className="text-zinc-400">Union</span>
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                    active
                      ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                  ].join(" ")}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-3 rounded-full bg-zinc-900 dark:bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right side ────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link href="/login">
                  <Button
                    size="sm"
                    className="h-8 rounded-full bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white text-sm font-medium px-4 transition-all duration-200"
                  >
                    Get started
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile menu ───────────────────────────────────────────────── */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  aria-label="Open menu"
                >
                  {mobileOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] p-0 border-l border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100 dark:border-zinc-800">
                  <Link
                    href="/"
                    className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Travel<span className="text-zinc-400">Buddy</span>
                  </Link>
                </div>

                {/* Mobile links */}
                <nav className="flex flex-col px-3 py-4 gap-0.5">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          active
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white",
                        ].join(" ")}
                      >
                        {item.label}
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile auth */}
                <div className="absolute bottom-0 inset-x-0 p-4 border-t rounded-lg border-zinc-100 dark:border-zinc-800">
                  {isLoggedIn ? (
                    <LogoutButton />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full h-9 text-sm rounded-lg"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full h-9 text-sm rounded-lg bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900">
                          Get started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;