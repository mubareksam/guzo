import Link from "next/link";
import { Code2, Heart, MessageCircle, Smartphone } from "lucide-react";
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

          {/* ── Download the App ──────────────────────────────────── */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <Smartphone size={14} /> Get the App
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://t.me/qmerservices_bot/guzo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cream/10 px-4 py-2.5 text-xs font-semibold text-cream transition hover:bg-cream/20"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121L8.485 12.57l-2.97-.93c-.643-.204-.657-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832.953z"/></svg>
                Open in Telegram
              </a>
              <a
                href="https://t.me/qmerservices_bot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cream/10 px-4 py-2.5 text-xs font-semibold text-cream transition hover:bg-cream/20"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121L8.485 12.57l-2.97-.93c-.643-.204-.657-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832.953z"/></svg>
                Android · iOS (Telegram)
              </a>
            </div>
            <p className="mt-2 text-[10px] text-cream/40">
              Guzo works as a web app — open in your browser and tap &ldquo;Add to Home Screen&rdquo; to install.
            </p>
          </div>
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
            Developed by{" "}
            <a
              href="https://t.me/qmerservices_bot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold tracking-wide text-gold underline decoration-gold/40 underline-offset-2 transition hover:text-cream hover:decoration-cream/60"
            >
              <MessageCircle size={12} />
              Qmer
            </a>
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
