

import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera, CameraPhoto } = Plugins;

export { CameraPhoto, Camera,  CameraResultType };

export const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl
  });
  return image
}
