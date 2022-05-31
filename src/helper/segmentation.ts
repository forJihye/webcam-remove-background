import { Results, SelfieSegmentation } from "@mediapipe/selfie_segmentation";

export function greenScreen(ctx: CanvasRenderingContext2D, results: Results) { // 그린 스크린 렌더
  ctx.save();
  ctx.translate(ctx.canvas.width, 0);
  ctx.scale(-1, 1);
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(results.segmentationMask, 0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Only overwrite existing pixels.
  ctx.globalCompositeOperation = 'source-out';
  ctx.fillStyle = '#00FF00';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Only overwrite missing pixels.
  ctx.globalCompositeOperation = 'destination-atop';
  ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.restore();
}

export function transparent(ctx: CanvasRenderingContext2D, results: Results) {
  ctx.save();
  ctx.translate(ctx.canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(ctx.canvas, 0, 0);
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Draw the mask
  ctx.drawImage(results.segmentationMask, 0, 0, ctx.canvas.width, ctx.canvas.height);
  // Add the original video back in only overwriting the masked pixels
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.restore();
}

const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
}});
selfieSegmentation.setOptions({
  modelSelection: 1,
});

export async function drawSegmentation (segmentation: SelfieSegmentation , ctx: CanvasRenderingContext2D, videoElement: HTMLVideoElement) {
  // segmentation.onResults(results => greenScreen(ctx, results));
  // await segmentation.send({image: videoElement});
  selfieSegmentation.onResults(results => greenScreen(ctx, results));
  await selfieSegmentation.send({image: videoElement});
}
