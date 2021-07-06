import { Camera, CameraResultType } from "@capacitor/camera";
import { popCypressEntry } from "@/utils/env";
export { Camera, CameraResultType };

export interface Photo {
  dataUrl: string;
  exif: any;
  format: string;
}

export const takePicture = async () => {
  const image =
    popCypressEntry("nextImage") ||
    (await Camera.getPhoto({
      quality: 90,
      // FIXME it appear this is broken on various android devices
      //   https://github.com/ionic-team/capacitor/issues/2994
      //   https://github.com/ionic-team/capacitor-plugins/issues/307
      // allowEditing: true,
      resultType: CameraResultType.DataUrl,
    }));
  return image as Photo;
};
