/* EVA Academy - Service Worker */
const CACHE_NAME = "eva-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "./alunos.html";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("alunos") && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SHOW_NOTIFICATION") {
    const title = data.title || "EVA Academy";
    const options = {
      body: data.body || "",
      icon: data.icon || undefined,
      badge: data.badge || undefined,
      tag: data.tag || "eva-geral",
      renotify: !!data.renotify,
      data: { url: data.url || "./alunos.html" }
    };
    self.registration.showNotification(title, options);
  }
});