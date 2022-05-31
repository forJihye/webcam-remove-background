import assets from "./assets";

const store = {
  get<T>(key: string): {type: string; data: T} {
    if (assets.has(key)) {
      return assets.get(key) as any;
    } else {
      return {type: 'error', data: null} as any;
    }
  },
  set(type: string, key: string, data: any) {
    assets.load(type, key, data);
  }
}

export default store;