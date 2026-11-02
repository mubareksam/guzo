"use client";

import { useEffect, useState } from "react";

export default function PwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Auto-show install button in footer
    const btn = document.getElementById("install-app-btn");
    if (btn) {
      btn.addEventListener("click", async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === "accepted") setIsInstalled(true);
          setDeferredPrompt(null);
        } else {
          // Show manual install instructions
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          if (isIOS) {
            alert("To install Guzo:\n\n1. Tap the Share button (□↑)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add'");
          } else {
            alert("To install Guzo:\n\n1. Tap the ⋮ menu in Chrome\n2. Tap 'Install app' or 'Add to Home screen'");
          }
        }
      });
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [deferredPrompt]);

  if (isInstalled) return null;
  return null; // The install button is in the footer, this just registers the SW
}
