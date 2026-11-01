import Link from "next/link";
import { Code2, Heart } from "lucide-react";
import { GuzoMark } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-forest/10 bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <GuzoMark size={42} />
            <div>
              <p className="text-lg font-bold leading-none">Guzo</p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-cream/60">ጉዞ · your journey</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
            A community map of every tera, light-rail platform and bus station in Addis Ababa — where vehicles leave from,
            where they go, which stops they pass, what they cost and how long the queue is right now.
          </p>
          <p className="mt-4 text-xs text-cream/50">
            Fares and waits are rider-reported estimates, not official figures. Confirm the destination with the redat before boarding.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Ride</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/75">
            <li><Link className="hover:text-cream" href="/plan">Plan a trip</Link></li>
            <li><Link className="hover:text-cream" href="/stations">All stations</Link></li>
            <li><Link className="hover:text-cream" href="/stations?mode=train">Light rail stations</Link></li>
            <li><Link className="hover:text-cream" href="/guide">Riding guide &amp; signs</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Community</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/75">
            <li><Link className="hover:text-cream" href="/contribute">Add or fix a station</Link></li>
            <li><Link className="hover:text-cream" href="/leaderboard">Leaderboard</Link></li>
            <li><Link className="hover:text-cream" href="/feedback">Suggestions</Link></li>
            <li><Link className="hover:text-cream" href="/dashboard">My profile</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:justify-between sm:px-6">
          <p className="flex items-center gap-1.5">
            <Code2 size={14} className="text-gold" />
            Developed by <span className="font-bold tracking-wide text-gold">Qmer</span>
            <Heart size={12} className="text-brick" fill="currentColor" />
            <span className="text-cream/50">© {new Date().getFullYear()} Guzo</span>
          </p>
          <p>
            Map data © <a className="underline hover:text-cream" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors · Routing by OSRM
          </p>
        </div>
      </div>
    </footer>
  );
}
