"use client";

import dynamic from "next/dynamic";

const MapCanvas = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#eef0ea]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-forest/20 border-t-forest" />
        <p className="mt-2 text-xs font-medium text-ink/50">Loading the map…</p>
      </div>
    </div>
  ),
});

export default MapCanvas;
