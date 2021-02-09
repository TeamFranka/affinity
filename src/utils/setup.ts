import Parse from 'parse';

import { Plugins, PushNotificationToken } from '@capacitor/core';

const { PushNotifications, Device } = Plugins;

export async function generateInstallation(opts: any): Promise<Parse.Installation> {
  const info = await Device.getInfo();
  const install = new Parse.Installation();
  install.set({
    "deviceName": info.name,
    "deviceModel": info.model,
    "appIdentifier": info.appId,
    "appName": info.appName,
    "appVersion": info.appVersion,
    "appBuild": info.appBuild,
    "deviceType": info.platform,
    "installationId": info.uuid,
    // "localeIdentifier": info,
    "GCMSenderId": process.env.VUE_APP_GCM_SENDER_ID,
  });
  install.set(opts);
  return install;
}

export function setupNotificationActions(
  onNotification: any, onNotificationAction: any
) {
  if (onNotification) {
    PushNotifications.addListener('pushNotificationReceived', onNotification);
  }

  if (onNotificationAction) {
    PushNotifications.addListener('pushNotificationActionPerformed',onNotificationAction);
  }
}

export function initInstallation(): Promise<Parse.Installation> {
  const promise: Promise<Parse.Installation> = new Promise((resolve, reject) => {
    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      generateInstallation({"deviceToken": token.value})
        .then((x: Parse.Installation) => resolve(x))
        .catch((x: any) => reject(x));
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.warn('Error on registration', error);
      reject(error);
    });
  });

  // Request permission to use push notifications
  // iOS will prompt user and return if they granted permission or not
  // Android will just grant without prompting
  PushNotifications.requestPermission().then(result => {
    console.log("received permission for push", result);
    if (result.granted) {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });

  return promise
}
