import Parse from 'parse';
import { isPlatform, getPlatforms } from '@ionic/vue';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications, Device } = Plugins;

export async function setupNotificationInfra(token: string) {

  const info = await Device.getInfo();
  console.log(info);

  const install = new Parse.Installation();
  install.set("deviceType", getPlatforms().toString());
  install.set("deviceName", info.name);
  install.set("deviceModel", info.model);
  install.set("appIdentifier", info.appId);
  install.set("appName", info.appName);
  install.set("appVersion", info.appVersion);
  install.set("appBuild", info.appBuild);
  install.set("deviceType", info.platform);
  install.set("installationId", info.uuid);
  install.set("GCMSenderId", process.env.VUE_APP_GCM_SENDER_ID);
  install.set("deviceToken", token);
  // install.set("appVersion", __VERSION);
  // install.set("parseVersion", Parse.version);

  await install.save(null).then((install: any) => {
      // Execute any logic that should take place after the object is saved.
      console.log('New Installation object created: ',install.toJSON());
      if (window.localStorage) {
          window.localStorage.setItem('sysInstall', install.toJSON());
      }

      return true
    }, (error: any) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      console.log('Failed to create new object, with error code:' + error.message.toString());
      return false
    }
  );
}

export function setupNotifications() {

  console.log("checking for notifications");
  if (!isPlatform('mobile')) {
    console.log("we are not mobile");
    return;
  }

  // we currently ignore Web
  // if (window.localStorage) {
  //   const install = window.localStorage.getItem('sysInstall');

  //   if (install){
  //     console.log("Installation already found", install);
  //     return  true;
  //   }
  // }

  console.log("localstorage", window.localStorage);

  PushNotifications.addListener(
    'registration',
    (token: PushNotificationToken) => {
      setupNotificationInfra(token.value);
    },
  );

  PushNotifications.addListener('registrationError', (error: any) => {
    alert('Error on registration: ' + JSON.stringify(error));
  });

  PushNotifications.addListener(
    'pushNotificationReceived',
    (notification: PushNotification) => {
      alert('Push received: ' + JSON.stringify(notification));
    },
  );

  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification: PushNotificationActionPerformed) => {
      alert('Push action performed: ' +  JSON.stringify(notification));
    },
  );


  // Request permission to use push notifications
  // iOS will prompt user and return if they granted permission or not
  // Android will just grant without prompting
  PushNotifications.requestPermission().then(result => {
    console.log("fake", result);
    if (result.granted) {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });
}

export async function setupAll() {
  await Promise.all([
    setupNotifications()
  ]);
}