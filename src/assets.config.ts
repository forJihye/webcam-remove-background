export const DEFAULT_WEBCAM = Symbol();

const assetsConfig = {
  webcam: {
    type: 'webcam',
    src: DEFAULT_WEBCAM
  },
  bg1: {
    type: 'image',
    src: 'https://picsum.photos/id/1015/1280/720'
  },
  bg2: {
    type: 'image',
    src: 'https://picsum.photos/id/1018/1280/720'
  },
  bg3: {
    type: 'image',
    src: 'https://picsum.photos/id/1043/1280/720'
  },
  segmentation: {
    type: 'segmentation',
    src: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation'
  }
}

export default assetsConfig;