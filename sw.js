// Service worker voor Baby dagboek — nodig om meldingen te tonen op Android.
// Toont voedingsherinneringen en opent de app bij het aantikken van een melding.

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// De pagina kan een melding vragen via postMessage (fallback als er geen
// geplande melding via TimestampTrigger mogelijk is).
self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type === "show-notification") {
    self.registration.showNotification(d.title || "Baby dagboek", {
      body: d.body || "",
      tag: d.tag || "baby-voeding",
      renotify: true,
      requireInteraction: false,
    });
  }
});

// Tik op de melding → app naar voren halen (of openen).
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cls) => {
      for (const c of cls) {
        if ("focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(".");
    })
  );
});
