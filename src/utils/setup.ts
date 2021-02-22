import Parse from 'parse';
import { isPlatform } from '@ionic/vue';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { App as AppInfo } from '@capacitor/app';

export function isMobileInstallation() {
  return isPlatform('mobile') && !document.URL.startsWith('http')
}

export async function generateInstallation(opts: any): Promise<Parse.Installation> {
  const deviceInfo = await Device.getInfo();
  const appInfo = await AppInfo.getInfo();
  const install = new Parse.Installation();
  install.set({
    "deviceName": deviceInfo.name,
    "deviceModel": deviceInfo.model,
    "appIdentifier": appInfo.id,
    "appName": appInfo.name,
    "appVersion": appInfo.version,
    "appBuild": appInfo.build,
    "deviceType": deviceInfo.platform,
    "installationId": deviceInfo.uuid,
    // "localeIdentifier": deviceInfo,
    "GCMSenderId": process.env.VUE_APP_GCM_SENDER_ID,
  });
  install.set(opts);
  return install;
}

export function setupNotificationActions(
  onNotification: any, onNotificationAction: any
) {
  if (!isMobileInstallation()) {
    console.log("Not a mobile device with push notification support");
    return;
  }
  if (onNotification) {
    PushNotifications.addListener('pushNotificationReceived', onNotification);
  }

  if (onNotificationAction) {
    PushNotifications.addListener('pushNotificationActionPerformed', onNotificationAction);
  }
}

export function initInstallation(): Promise<Parse.Installation> {
  const promise: Promise<Parse.Installation> = new Promise((resolve, reject) => {
    PushNotifications.addListener('registration', (token: Token) => {
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

  return promise
}
