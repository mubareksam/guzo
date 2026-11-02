import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guzo — Addis Ababa Transit Planner",
    short_name: "Guzo",
    description:
      "Find every taxi station (tera) in Addis Ababa, plan multimodal trips across minibuses, city buses, light rail, and bajajs. Live queue reports, fare info, and community-sourced data.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f9f5ea",
    theme_color: "#124532",
    categories: ["navigation", "travel", "utilities"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Plan a Trip",
        short_name: "Plan",
        url: "/plan",
        description: "Plan a trip from here to anywhere in Addis Ababa",
      },
      {
        name: "Nearby Stations",
        short_name: "Stations",
        url: "/stations",
        description: "View all taxi stations near you",
      },
    ],
  };
}
