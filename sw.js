/* Nahrain School PWA Service Worker — Supabase Web Push */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {
    try { data = { body: event.data ? event.data.text() : "" }; } catch (_) {}
  }
  const title = data.title || "النهرين";
  const options = {
    body: data.body || "لديك إشعار جديد من المدرسة",
    dir: "rtl",
    lang: "ar",
    tag: data.tag || "nahrain-notification",
    renotify: true,
    data: { url: data.url || "/#notifications" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || "/#notifications", self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(target);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
