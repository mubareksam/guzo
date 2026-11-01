import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guzo — Addis Ababa taxi station map",
    short_name: "Guzo",
    description:
      "Find every taxi station (tera) in Addis Ababa, compare minibus, bus and light rail routes, and keep the map fresh with rider reports.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f5ea",
    theme_color: "#124532",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
