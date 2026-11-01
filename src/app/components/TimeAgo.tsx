"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";

export default function TimeAgo({ iso, className }: { iso: string; className?: string }) {
  const [label, setLabel] = useState("recently");

  useEffect(() => {
    const update = () => setLabel(timeAgo(iso));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [iso]);

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label}
    </time>
  );
}
