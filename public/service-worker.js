// @ts-ignore
const CACHE_NAME = 'my-cache';
const installEvent = () => {
  self.addEventListener("install", (event) => {
    console.log("service worker installed");
    
      // @ts-ignore
  //     event.waitUntil(
  //   caches.open(CACHE_NAME).then(cache => {
  //     return cache.addAll([
  //       '/',
       
  //       // Add more assets to cache
  //     ]);
  //   })
  // );
  });

  self.addEventListener('fetch', event => {
  // @ts-ignore
  event.respondWith(
    // @ts-ignore
    caches.match(event.request).then(response => {
      // @ts-ignore
      return response || fetch(event.request);
    })
  );
});
  
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated");
  });
  
};
activateEvent();

self.addEventListener("push", (event) => {
  // @ts-ignore
  const data = event.data.text();
  // @ts-ignore
  const message = JSON.parse(data);
  console.log(message);
  const title = "New Message";
  const body = "You have a new message from " + message.userName;
  // @ts-ignore

  // @ts-ignore
  const notificationOptions = {
    body: body,
    tag: "simple-push-notification-example",
    icon: "chat-message.png",
    url: "https://google.com",
  };
  // @ts-ignore
  // new Notification(title, notificationOptions);
  // browser.notifications.create("id", {
  //   type: "basic",
  //   iconUrl: "chat-message.png",
  //   title: title,
  //   message: body,
  // });
  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("visibilitychange", () => {
  // @ts-ignore
  if (self.visibilityState === "visible") {
    // @ts-ignore
    self.registration.getNotifications().then((notifications) => {
      // @ts-ignore
      notifications.forEach((notification) => {
        notification.close();
      });
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  // @ts-ignore
  event.notification.close();
  // @ts-ignore
  clients.openWindow("/");
});
