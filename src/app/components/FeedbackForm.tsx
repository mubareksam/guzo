"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { value: "suggestion", label: "Suggestion", icon: "💡" },
  { value: "bug", label: "Bug report", icon: "🐞" },
  { value: "praise", label: "Praise", icon: "💚" },
  { value: "partnership", label: "Partnership", icon: "🤝" },
];

export default function FeedbackForm({ defaultName, isLoggedIn }: { defaultName?: string; isLoggedIn: boolean }) {
  const router = useRouter();
  const [category, setCategory] = useState("suggestion");
  const [name, setName] = useState(defaultName ?? "");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setNotice(null);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, message }),
      });
      if (!response.ok) {
        let errorMsg = "Could not send feedback.";
        try { const errData = await response.json(); errorMsg = errData?.error ?? errorMsg; } catch { errorMsg = `Server error (${response.status}).`; }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setState("done");
      setNotice(data.message);
      setMessage("");
      router.refresh();
    } catch (error) {
      setState("error");
      setNotice((error as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-forest/10 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-ink">Say what you think</h2>
      <p className="mt-1 text-xs text-ink/55">
        Feature ideas, confusing screens, partnerships or a broken stop — this goes straight to the Guzo team.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {CATEGORIES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setCategory(option.value)}
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition ${
              category === option.value ? "border-forest bg-forest/5" : "border-forest/10 hover:border-forest/25"
            }`}
          >
            <span aria-hidden>{option.icon}</span>
            <span className="text-xs font-semibold text-ink">{option.label}</span>
          </button>
        ))}
      </div>

      {!isLoggedIn ? (
        <label className="mt-4 block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Your name (optional)</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            placeholder="How should we credit you?"
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/40"
          />
        </label>
      ) : null}

      <label className="mt-3 block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">Message *</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          maxLength={1200}
          placeholder="Tell us what would make Guzo more useful for your daily trip…"
          className="mt-1.5 w-full resize-y rounded-xl border border-forest/15 bg-cream/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/40"
        />
      </label>

      {notice ? (
        <p
          className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium ${
            state === "error" ? "bg-brick/10 text-brick" : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {notice}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "saving"}
        className="mt-4 w-full rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-cream transition hover:bg-forest/90 disabled:opacity-60"
      >
        {state === "saving" ? "Sending…" : "Send feedback"}
      </button>
      <p className="mt-2 text-center text-[11px] text-ink/45">
        Public messages appear on the board below. Private details stay with the team.
      </p>
    </form>
  );
}
