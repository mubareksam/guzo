import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/app/components/AuthForm";
import { GuzoMark } from "@/app/components/SiteHeader";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid overflow-hidden rounded-[28px] border border-forest/10 bg-white shadow-[0_24px_60px_rgba(13,32,24,0.08)] lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-forest p-8 text-cream lg:flex">
          <div className="flex items-center gap-3">
            <GuzoMark size={40} />
            <div>
              <p className="text-lg font-bold leading-none">Guzo</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cream/60">ጉዞ · Addis tera map</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold leading-snug">Every tera, every fare, every queue — in one place.</h2>
            <ul className="mt-5 space-y-2 text-xs text-cream/75">
              <li>✦ Save your reports and see your history</li>
              <li>✦ Earn badges from Newcomer to Guzo Legend</li>
              <li>✦ Help riders in your neighbourhood</li>
            </ul>
          </div>
          <p className="text-[11px] text-cream/50">Rider reports are estimates, not official figures.</p>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">Welcome back</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Log in to your rider profile</h1>
          <p className="mt-1 text-xs text-ink/55">
            Use <span className="font-semibold text-ink/75">demo@guzo.et</span> / <span className="font-semibold text-ink/75">guzo1234</span> to explore (moderator: <span className="font-semibold text-ink/75">admin@guzo.et</span>).
          </p>
          <div className="mt-5">
            <AuthForm mode="login" />
          </div>
          <p className="mt-4 text-center text-[11px] text-ink/45">
            You can still <Link href="/plan" className="font-semibold text-forest hover:underline">plan a trip</Link> without an account.
          </p>
        </div>
      </div>
    </div>
  );
}
