import { check } from "prettier";
import { addSubsciption } from "~/actions/actions";

export const handleNotificationSetup = (userEmail: string) => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length === 0) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) =>
            navigator.serviceWorker.ready.then(() =>
              registration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey:
                    "BAeRtWPMnIVjZBidFdKLRP4P7FB6ekbe3bThEofCHASAYtloHpfeWI0Zd0SBePtkzy5UT8czPQUHviFbEm20llY",
                })
                .then((subscription) => {
                  addSubsciption(
                    JSON.stringify(subscription.toJSON()),
                    userEmail
                  );
                  console.log(subscription);
                })
            )
          );
      } else {
        registrations[0]?.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BAeRtWPMnIVjZBidFdKLRP4P7FB6ekbe3bThEofCHASAYtloHpfeWI0Zd0SBePtkzy5UT8czPQUHviFbEm20llY",
          })
          .then((subscription) => {
            addSubsciption(JSON.stringify(subscription.toJSON()), userEmail);
            console.log(subscription);
          });
      }
    });
  
    checkNotificationPermission();
  }
};

const checkNotificationPermission = () => {
  if (Notification.permission === "granted") return;
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
};
