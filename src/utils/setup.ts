import Parse from "parse";
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { Device } from "@capacitor/device";
import { Capacitor } from "@capacitor/core";
import { App as AppInfo } from "@capacitor/app";
import { popCypressEntry, getCypressEntry } from "@/utils/env";

export function isMobileInstallation() {
  if (getCypressEntry("isMobile")) {
    return true;
  }
  return Capacitor.isNativePlatform();
}

export async function deviceLocale(): Promise<string> {
  return Device.getLanguageCode().then((x) => x.value);
}

export async function generateInstallation(
  opts: any
): Promise<Parse.Installation> {
  const localeIdentifier = await deviceLocale();
  const deviceInfo = await Device.getInfo();
  const appInfo = await AppInfo.getInfo();
  const install = new Parse.Installation();
  install.set({
    localeIdentifier,
    deviceName: deviceInfo.name,
    deviceModel: deviceInfo.model,
    appIdentifier: appInfo.id,
    appName: appInfo.name,
    appVersion: appInfo.version,
    appBuild: appInfo.build,
    deviceType: deviceInfo.platform,
    installationId: deviceInfo.uuid,
    // "localeIdentifier": deviceInfo,
    GCMSenderId: process.env.VUE_APP_GCM_SENDER_ID,
  });
  install.set(opts);
  return install;
}

export function setupNotificationActions(
  onNotification: any,
  onNotificationAction: any
) {
  if (!Capacitor.isPluginAvailable("PushNotifications")) {
    console.log("No push notification support");
    return;
  }
  if (onNotification) {
    PushNotifications.addListener("pushNotificationReceived", onNotification);
  }

  if (onNotificationAction) {
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      onNotificationAction
    );
  }
}

export function initInstallation(): Promise<Parse.Installation> {
  const cypressDevice = popCypressEntry("device");
  console.log("device", cypressDevice);
  if (cypressDevice) {
    const installation = new Parse.Installation();
    installation.set(cypressDevice);
    return Promise.resolve(installation);
  }
  const promise: Promise<Parse.Installation> = new Promise(
    (resolve, reject) => {
      if (Capacitor.isPluginAvailable("PushNotifications")) {
        PushNotifications.addListener("registration", (token: Token) => {
          generateInstallation({ deviceToken: token.value })
            .then((x: Parse.Installation) => resolve(x))
            .catch((x: any) => reject(x));
        });

        PushNotifications.addListener("registrationError", (error: any) => {
          console.warn("Error on registration", error);
          reject(error);
        });
      }
    }
  );

  // Request permission to use push notifications
  // iOS will prompt user and return if they granted permission or not
  // Android will just grant without prompting
  if (Capacitor.isPluginAvailable("PushNotifications")) {
    PushNotifications.requestPermissions().then((result: any) => {
      console.log("received permission for push", result);
      if (result.receive == "granted") {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.warn("request for push notifications failed", result);
        // Show some error
      }
    });
  }

  return promise;
}
