import assetsConfig from "@/assets.config";
import assets from "./assets";

export const errorMessageImg = async (src: string) => {
  return await new Promise<HTMLImageElement|null>(res => {
    const img = new Image;
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

export const findMediaDevices = async (src: string) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const filter = devices.filter(({label}) => label.toLowerCase().indexOf(src.toLowerCase()) !== -1);
  const devicesGroup = filter.reduce((acc: {groupId: string; devices: MediaDeviceInfo[]}[], val: MediaDeviceInfo) => {
    const groupd = acc.find(({groupId}) => groupId === val.groupId) ?? (acc.push({groupId: val.groupId, devices: []}), acc[acc.length - 1]);
    groupd.devices.push(val);
    return acc;
  }, []) as {groupId: string; devices: MediaDeviceInfo[]}[];
  return devicesGroup;
}

const promisesCallback = (promises: Promise<any>[], callback: (val: number, total: number) => void) => {
  let length = promises.length;
  let value = 0;

  const tick = (promise: Promise<any>) => {
    promise.then(() => {
      value++;
      callback(value, length);
    });
    return promise;
  }
  return Promise.all(promises.map(tick));
}

export const assetsLoad = async (config: typeof assetsConfig) => {
  const promises = Object.entries(config).map(([key, {type, src}]) => assets.load(type, key, src));
  return promisesCallback(promises, (val, total) => {
    const current = Math.round(val / total * 100);
    console.log(current);
  })
  // return await Promise.all(Object.entries(config).map(async ([key, {type, src}]) => await assets.load(type, key, src)));
}