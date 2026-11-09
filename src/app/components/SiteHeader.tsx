"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FileStack, Home, LogIn, LogOut, MapPinned, MessageSquareText, Navigation, PlusCircle, ShieldCheck, Trophy, UserRound } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { badgeFor } from "@/lib/badges";
import DarkModeToggle from "./DarkModeToggle";

const links = [
  { href: "/organizer", label: "Organizer", icon: FileStack },
  { href: "/plan", label: "Plan a trip", icon: Navigation },
  { href: "/stations", label: "Stations", icon: MapPinned },
  { href: "/contribute", label: "Contribute", icon: PlusCircle },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/feedback", label: "Feedback", icon: MessageSquareText },
];

export function GuzoMark({ size = 38 }: { size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-[30%] bg-forest text-gold shadow-[0_8px_20px_rgba(18,69,50,0.28)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" width={size * 0.7} height={size * 0.7} fill="none">
        <path d="M7 25c0-6 4-7 9-9s8-3 8-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 4" />
        <circle cx="7" cy="25" r="3" fill="currentColor" />
        <circle cx="24" cy="8" r="3.2" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    </span>
  );
}

export default function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const badge = user ? badgeFor(user.points) : null;

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggingOut(false);
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="sticky top-0 z-[1000] border-b border-forest/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <GuzoMark size={34} />
            <span className="leading-none">
              <span className="block text-[18px] font-bold tracking-tight text-ink">Guzo</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.26em] text-moss sm:text-[10px]">ጉዞ · Addis transit</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive(href) ? "bg-forest text-cream" : "text-ink/70 hover:bg-forest/5 hover:text-ink"
                }`}
              >
                <Icon size={15} strokeWidth={2.2} />
                {label}
              </Link>
            ))}
            {user?.isAdmin ? (
              <Link
                href="/admin"
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ${isActive("/admin") ? "bg-forest text-cream" : "text-ink/70 hover:bg-forest/5"}`}
              >
                <ShieldCheck size={15} /> Review
              </Link>
            ) : null}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 py-1 pl-1 pr-1 sm:pr-3 hover:border-forest/30">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/25 text-sm">{badge?.icon}</span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block max-w-[120px] truncate text-xs font-semibold text-ink">{user.name}</span>
                    <span className="block text-[10px] text-ink/55">
                      {user.points} pts · {badge?.am}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  disabled={loggingOut}
                  aria-label="Log out"
                  className="hidden h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-forest/5 hover:text-ink disabled:opacity-50 sm:grid"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 hover:text-ink sm:inline-flex">
                  Log in
                </Link>
                <Link href="/register" className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-xs font-semibold text-cream shadow-sm hover:bg-forest/90 sm:px-4 sm:text-sm">
                  <LogIn size={15} className="sm:hidden" />
                  Join Guzo
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile & tablet bottom navigation */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-[1000] border-t border-forest/10 bg-white/95 backdrop-blur-xl lg:hidden" aria-label="Primary">
        <div className="mx-auto grid max-w-xl grid-cols-5 px-2 pt-1.5">
          {[
            { href: "/", label: "Home", icon: Home },
            { href: "/plan", label: "Plan", icon: Navigation },
            { href: "/stations", label: "Stations", icon: MapPinned },
            { href: "/contribute", label: "Add", icon: PlusCircle },
            { href: user ? "/dashboard" : "/login", label: user ? "Me" : "Log in", icon: UserRound },
          ].map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={label} href={href} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold">
                <span className={`grid h-8 w-12 place-items-center rounded-full transition ${active ? "bg-forest text-cream" : "text-ink/55"}`}>
                  <Icon size={19} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={active ? "text-forest" : "text-ink/55"}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
