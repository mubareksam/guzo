import Link from "next/link";
import { Code2, Heart, Download, MessageCircle } from "lucide-react";
import { GuzoMark } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-forest/10 bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <GuzoMark size={40} />
            <div>
              <p className="text-lg font-bold leading-none">Guzo</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cream/60">ጉዞ · your journey</p>
            </div>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/75">
            Every tera, bus stop, and light-rail platform in Addis Ababa — planned, verified, and kept fresh by riders like you.
          </p>

          {/* ── Install the App ─────────────────────────────────── */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Install Guzo</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                id="install-app-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-cream px-4 py-2.5 text-xs font-bold text-forest transition hover:bg-gold hover:text-ink"
              >
                <Download size={16} />
                Install App
              </button>
              <a
                href="https://t.me/qmerservices_bot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cream/10 px-4 py-2.5 text-xs font-semibold text-cream transition hover:bg-cream/20"
              >
                <MessageCircle size={14} />
                Telegram Bot
              </a>
            </div>
            <p className="mt-2 text-[10px] text-cream/40">
              iOS: Safari → Share → Add to Home Screen &nbsp;·&nbsp; Android: Chrome → ⋮ → Install app
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/75">
            <li><Link className="hover:text-cream" href="/plan">Plan a trip</Link></li>
            <li><Link className="hover:text-cream" href="/stations">All stations</Link></li>
            <li><Link className="hover:text-cream" href="/stations?mode=train">Light rail</Link></li>
            <li><Link className="hover:text-cream" href="/guide">Riding guide</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Community</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/75">
            <li><Link className="hover:text-cream" href="/contribute">Fix the map</Link></li>
            <li><Link className="hover:text-cream" href="/leaderboard">Leaderboard</Link></li>
            <li><Link className="hover:text-cream" href="/feedback">Feedback</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-4 text-[11px] text-cream/50 sm:flex-row sm:justify-between sm:px-6">
          <p className="flex items-center gap-1.5">
            <Code2 size={13} className="text-gold" />
            <a
              href="https://t.me/qmerservices_bot"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-gold hover:text-cream"
            >Qmer</a>
            <span className="text-cream/30">·</span>
            <span>© {new Date().getFullYear()}</span>
          </p>
          <p>
            © <a className="underline hover:text-cream" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
