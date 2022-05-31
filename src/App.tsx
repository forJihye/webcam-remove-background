import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { raf } from "./helper";
import { drawTransparent } from "./helper/canvas";
import { drawSegmentation } from "./helper/segmentation";

import store from "./store";
import assets from "./store/assets";

const App: FC<{assets: typeof assets; store: typeof store}> = ({assets, store}) => {
  const [bgImg, setBgImg] = useState<HTMLImageElement>(store.get<HTMLImageElement>('bg1').data);
  
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);

  const {data: video} = store.get<HTMLVideoElement>('webcam');
  const {data: segmentation} = store.get<SelfieSegmentation>('segmentation');

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = 1280;
    canvas.height = 720;

    const vcanvas = Object.assign(document.createElement('canvas'), {width: canvas.width, height: canvas.height}) as HTMLCanvasElement; // 비디오 캔버스
    const bcanvas = Object.assign(document.createElement('canvas'), {width: canvas.width, height: canvas.height}) as HTMLCanvasElement; // 배경이미지 캔버스
    
    const vctx = vcanvas.getContext('2d') as CanvasRenderingContext2D;
    const bctx = bcanvas.getContext('2d') as CanvasRenderingContext2D;
    
    video.onplaying = async () => {
      const getFrames = async () => {
        await drawSegmentation(segmentation, vctx, video);
        drawTransparent(vctx, ctx);
        ctx.drawImage(vcanvas, 0, 0); 
        // bctx.drawImage(bgImg, 0, 0);
        // await drawSegmentation(segmentation, vctx, video);
        // drawTransparent(vctx, ctx);
        // bctx.drawImage(vcanvas, 0, 0);
        // ctx.drawImage(bcanvas, 0, 0); 
        requestAnimationFrame(getFrames);
      }
      await getFrames();
    }
  }, []);

  useEffect(() => {
    if (!backgroundRef.current) return;
    const canvas = backgroundRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = 1280;
    canvas.height = 720;
    ctx.drawImage(bgImg, 0, 0);
  }, [bgImg]);
  
  const backgroundHandler = (index: number) => (ev: MouseEvent) => {
    const {data: bgImg} = store.get<HTMLImageElement>(`bg${index}`);
    setBgImg(bgImg);
  }

  const takePictureHandler = () => {
    const canvas = Object.assign(document.createElement('canvas'), {width: 1280, height: 720}) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pcanvas = photoRef.current as HTMLCanvasElement
    const pctx = pcanvas.getContext('2d') as CanvasRenderingContext2D;
    pcanvas.width = canvas.width;
    pcanvas.height = canvas.height;
    const wcanvas = canvasRef.current as HTMLCanvasElement;
    const bcanvas = backgroundRef.current as HTMLCanvasElement;
    ctx.drawImage(bcanvas, 0, 0);
    ctx.drawImage(wcanvas, 0, 0);
    pctx.drawImage(canvas, 0, 0);
    store.set('canvas', 'photo', canvas);
  }

  return <div id="app">
    <div style={{position: 'relative', height: 720}}>
      <canvas style={{position: 'absolute', left: 0, top: 0, zIndex: 5}} ref={canvasRef}></canvas>
      <canvas style={{position: 'absolute', left: 0, top: 0, zIndex: 1}} ref={backgroundRef}></canvas>
    </div>

    <ul style={{display: 'flex'}}>
      {[
        store.get<HTMLImageElement>('bg1').data,
        store.get<HTMLImageElement>('bg2').data,
        store.get<HTMLImageElement>('bg3').data
      ].map((img, i) => (
        <li key={`bg-${i}`} style={{cursor: 'pointer'}}>
          <img src={img.src} width='200' onClick={backgroundHandler(i + 1)} />
        </li>
      ))}
    </ul>
    <div>
      <button type="button" onClick={takePictureHandler}>촬영</button>
    </div>
    <div>
      <canvas ref={photoRef}></canvas>
    </div>
  </div>
}

export default App;