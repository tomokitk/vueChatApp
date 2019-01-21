self.addEventListener('install', function(event) {
  console.log('kokokookokko')
  console.log(event)
});
self.addEventListener("push", function(event) {
  console.log('push')
  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription.endpoint
        }
        throw new Error('User not subscribed')
    })
    .then(function(res) {
      return self.registration.showNotification('push通知', {
        body: 'チャットアプリだよ'
      })
    })
  )
});
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://vuechatapp-8a8d0.firebaseapp.com/#/')
  );
});



