import { DEFAULT_WEBCAM } from "@/assets.config";
import { loadImage } from "@/helper";
import { errorMessageImg, findMediaDevices } from "./utils";
import {Results, SelfieSegmentation} from '@mediapipe/selfie_segmentation';

const assets = new class Assets extends Map<string, {type: string; data: any}> {
  async load (type: string, key: string, src: any) {
    if (type === 'webcam') {
      const devicesGroup = await findMediaDevices((src === DEFAULT_WEBCAM ? '' : src) as string) as {groupId: string; devices: MediaDeviceInfo[]}[];
      if (devicesGroup.length > 1) console.warn('To many devices groups!', devicesGroup);
      const videoDevices = devicesGroup.filter(({devices}) => devices.find(({kind}) => kind === 'videoinput'));
      if (videoDevices.length > 1) console.warn('To many video devices!', videoDevices);
      if (!videoDevices.length) {
        console.warn(`Not Found Video Media Devices!`, videoDevices);
        const img = await errorMessageImg('https://dummyimage.com/600x100/666666/ffffff&text=Not+Found+Webcam');
        this.set(key, {type, data: img});
      } else {
        const devices = videoDevices[0].devices;
        const videoDevice = devices.flat().find(({kind}) => kind == 'videoinput');
        if (!videoDevice) {
          console.warn(`Not Found Video Media Devices!`, videoDevice);
          const img = await errorMessageImg('https://dummyimage.com/600x100/666666/ffffff&text=Not+Found+Webcam');
          this.set(key, {type, data: img});
        } else {
          try {
            const video = document.createElement('video');
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: {ideal: 1920},
                height: {ideal: 1080},
                frameRate: {max: 60},
                deviceId: videoDevice.deviceId
              }
            });
            video.srcObject = stream;
            video.play();
            this.set(key, {type, data: video});
          } catch (e) {
            console.warn(e);
            const img = await errorMessageImg('https://dummyimage.com/600x100/666666/ffffff&text=Webcam+Video+Error');
            this.set(key, {type, data: img});
          }
        }
      }
    } 
    else if (type === 'image') {
      const img = await loadImage(src, true);
      this.set(key, {
        type,
        data: img ?? null
      })
    }
    else if (type === 'number' || type === 'string' || type === 'canvas' || type === 'boolean') {
      this.set(key, {type, data: src});
    }
    else if (type === 'segmentation') {
      const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => `${src}/${file}`});
      selfieSegmentation.setOptions({
        modelSelection: 1
      })
      this.set(key, {type, data: selfieSegmentation});
    }
  }
}

export default assets;