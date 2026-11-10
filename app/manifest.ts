import type { MetadataRoute } from "next";

// Makes the website installable on a phone ("Add to Home screen").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DEENI HISAB | دینی حساب",
    short_name: "Deeni Hisab",
    description: "Hanafi fiqh guided Mirath and Zakat calculator. Educational tool, not a fatwa.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf8f1",
    theme_color: "#0f5132",
    lang: "ur",
    icons: [
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
