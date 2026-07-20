export function registerServiceWorker() {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator
  ) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        console.log("✅ Service Worker Registered", registration);
      } catch (error) {
        console.error("❌ Service Worker Registration Failed", error);
      }
    });
  }
}