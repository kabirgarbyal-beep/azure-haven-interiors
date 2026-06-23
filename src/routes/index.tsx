import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import siteBody from "../site-body.html?raw";
import luxeCssUrl from "../luxe.css?url";
import luxeJsUrl from "../luxe.js?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Lumière — Luxury Interior Design Atelier" },
      { name: "description", content: "Maison Lumière is a luxury interior design atelier crafting villas, penthouses and signature residences with architectural elegance." },
      { property: "og:title", content: "Maison Lumière — Luxury Interior Atelier" },
      { property: "og:description", content: "Architectural interiors for villas, penthouses and signature residences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Maison Lumière — Luxury Interior Atelier" },
      { name: "twitter:description", content: "Architectural interiors for villas, penthouses and signature residences." },
    ],
    links: [
      { rel: "stylesheet", href: luxeCssUrl },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = luxeJsUrl;
    s.defer = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: siteBody }} />;
}
