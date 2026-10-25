self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch (_) {}
  const title = payload.title || 'Weekly Planning Suite';
  const options = {
    body: payload.body || 'You have an upcoming event.',
    data: { url: payload.url || './' },
    tag: payload.tag || 'weekly-planner-reminder',
    renotify: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url || './';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) if ('focus' in client) { client.navigate(url); return client.focus(); }
    return clients.openWindow(url);
  }));
});
