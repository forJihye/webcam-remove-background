export const loadImage = (src: string, crossOrigin: boolean = false, timeout: number = 10000): Promise<HTMLImageElement|null> => {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    crossOrigin && (img.crossOrigin = 'Anonymous');
    img.src = src;
    let timer: number;
    timer = setTimeout(() => (res(null), clearTimeout(timer)) , timeout);
  })
}

export const raf = new class RAF extends Set<Function> {
  playing: boolean = true;
  constructor () {
    super();
    const self = this;
    requestAnimationFrame(function draw(tick: number) {
      self.playing && self.forEach(f => f());
      requestAnimationFrame(draw);
    });
  }
  off() {
    this.playing = false;
  }
  on() {
    this.playing = true;
  }
}