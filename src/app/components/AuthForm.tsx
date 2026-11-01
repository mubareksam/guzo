"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeArea, setHomeArea] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setError(null);
    try {
      const response = await fetch(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? { name, email, password, homeArea } : { email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Something went wrong.");
      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setState("error");
      setError((caught as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {isRegister ? (
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Full name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            placeholder="Abebe Kebede"
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/45"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/45"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder="At least 6 characters"
          className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/45"
        />
      </label>

      {isRegister ? (
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Home area (optional)</span>
          <input
            value={homeArea}
            onChange={(event) => setHomeArea(event.target.value)}
            placeholder="e.g. Megenagna"
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/45"
          />
        </label>
      ) : null}

      {error ? <p className="rounded-xl bg-brick/10 px-3 py-2 text-xs font-medium text-brick">{error}</p> : null}

      <button
        type="submit"
        disabled={state === "saving"}
        className="w-full rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-cream transition hover:bg-forest/90 disabled:opacity-60"
      >
        {state === "saving" ? "Please wait…" : isRegister ? "Create my rider account" : "Log in to Guzo"}
      </button>

      {!isRegister ? (
        <>
          <button
            type="button"
            onClick={() => {
              setEmail("demo@guzo.et");
              setPassword("guzo1234");
            }}
            className="w-full rounded-xl border border-forest/15 px-4 py-2.5 text-xs font-semibold text-forest hover:bg-forest/5"
          >
            Use the demo rider account
          </button>
          <p className="text-center text-[11px] text-ink/50">
            New here?{" "}
            <Link href="/register" className="font-semibold text-forest hover:underline">Create an account</Link>
          </p>
        </>
      ) : (
        <p className="text-center text-[11px] text-ink/50">
          Already riding with us?{" "}
          <Link href="/login" className="font-semibold text-forest hover:underline">Log in</Link>
        </p>
      )}
    </form>
  );
}
