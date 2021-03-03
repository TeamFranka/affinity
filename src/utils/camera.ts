import { Camera, CameraResultType } from '@capacitor/camera';
export { Camera, CameraResultType };

export interface Photo {
  dataUrl: string;
  exif: any;
  format: string;
}

export const takePicture = async () =>  {
  if (window && (window as any).CYPRESS && (window as any).CYPRESS.nextImage) {
    // hack for testing image selecting
    const image = ((window as any).CYPRESS.nextImage as Photo);
    delete (window as any).CYPRESS.nextImage;
    return image
  }
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl
  });
  return (image as Photo)
}
