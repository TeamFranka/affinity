import { Camera, CameraResultType } from '@capacitor/camera';
export { Camera, CameraResultType };

export interface Photo {
  dataUrl: string;
  exif: any;
  format: string;
}

export const takePicture = async () =>  {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl
  });
  return (image as Photo)
}
