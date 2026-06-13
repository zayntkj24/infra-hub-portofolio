import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

// --- PENGAMAN TANSTACK ROUTER UNTUK SITEMAP ---
// Jika URL berakhiran .xml atau .txt, matikan rendering React SPA 
// dan paksa browser mengambil file statis asli dari server Vercel
if (typeof window !== "undefined") {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("sitemap.xml") || path.includes("robots.txt")) {
    // Cari elemen root dan bersihkan isinya agar tidak merender HTML kosong
    const rootEl = document.getElementById("root");
    if (rootEl) rootEl.innerHTML = "";
    
    // Hentikan eksekusi skrip JavaScript di sini agar server menyajikan file aslinya
    throw new Error("Bypassing React SPA for static assets routing.");
  }
}
// ----------------------------------------------

const router = getRouter();

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
