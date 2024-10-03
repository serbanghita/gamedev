interface ICanvasRenderingContext2DExtended extends CanvasRenderingContext2D {
    imageSmoothingEnabled: boolean;
    webkitImageSmoothingEnabled: boolean;
}

interface ICustomCSSStyleDeclaration extends CSSStyleDeclaration {
    imageRendering: string;
}

export function createCanvas(layerName: string, width: number, height: number, layerIndex?: string): HTMLCanvasElement {
    const $canvas = document.createElement("canvas");
    $canvas.id = "canvas-for-" + layerName;
    $canvas.width = width; // * window.devicePixelRatio || 1
    $canvas.height = height; // * window.devicePixelRatio || 1
    $canvas.setAttribute("tabindex", "1");
    $canvas.setAttribute("style", `background-color: transparent`);

    const canvasStyle = $canvas.style as ICustomCSSStyleDeclaration;
    canvasStyle.position = "absolute";
    canvasStyle.zIndex = layerIndex || "0";
    canvasStyle.width = $canvas.width + "px";
    canvasStyle.height = $canvas.height + "px";
    canvasStyle.imageRendering = "pixelated";

    const ctx = $canvas.getContext("2d") as ICanvasRenderingContext2DExtended; // { alpha: false }

    ctx.imageSmoothingEnabled = false;
    return $canvas;
}

export function renderImage(
    ctx: CanvasRenderingContext2D | null,
    img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    x: number, y: number,
    width: number, height: number,
    dX: number, dY: number,
    dWidth: number, dHeight: number
) {
    if (ctx == null) {
        throw Error("Canvas context is not defined.");
    }
    ctx.drawImage(
        img,
        // src
        x, y,
        width, height,
        // dest
        dX, dY, dWidth, dHeight
    );
}

export function renderTile(
    ctx: CanvasRenderingContext2D,
    tileSheetImg: HTMLImageElement,
    width: number, height: number,
    tileIndex: number, tileValue: number,
    sW: number, sH: number
) {

    // 515 448 288

    // Tiles per row in the animation image.
    const tilesPerRow = tileSheetImg.width / width;

    // Apparently tiled editor starts counting fromActor 1 with tileValue.
    const xOnSprite = ((tileValue - 1) - Math.floor((tileValue - 1) / tilesPerRow) * tilesPerRow) * width;
    const yOnSprite = Math.floor((tileValue - 1) / tilesPerRow) * height;
    // console.log(w, h, tileValue, xOnSprite, yOnSprite);

    console.log(xOnSprite, yOnSprite, width, height, Math.floor(tileIndex % sW) * width, Math.floor(tileIndex / sW) * height)

    ctx.drawImage(
        tileSheetImg,
        // Position on tileset.
        xOnSprite,
        yOnSprite,
        // Tile dimensions on tileset.
        width,
        height,
        // Position on screen.
        Math.floor(tileIndex % sW) * width,
        Math.floor(tileIndex / sW) * height,
        // Tile dimensions on screen
        width,
        height
    );
}

export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string = 'rgb(0,0,0)', size: number = 1) {
  // ctx.save();
  ctx.fillStyle = fillColor;
  ctx.fillRect(x,y,size,size);
  // ctx.restore();
}

export function rectangle(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    strokeColor: string = 'black', fillColor?: string
): void {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeColor;
    ctx.rect(x, y, width, height);
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, width, height);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

export function circle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  radius: number, strokeColor: string, fillColor?: string,
) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.strokeStyle = strokeColor;
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

export function getCtx(canvas: HTMLCanvasElement) {
    return canvas.getContext("2d");
}

export function clearCtx(ctx: CanvasRenderingContext2D | null, startX: number, startY: number, endX: number, endY: number): void {
    if (ctx === null) {
        throw Error('Cannot clear non-existent Canvas context.');
    }
    ctx.clearRect(startX, startY, endX, endY);
}



export function run(fn: (now: DOMHighResTimeStamp) => void) {
  let fps = 0;
  let lastTime = 0;
  let frameCount = 0;

  const loop = (now: DOMHighResTimeStamp) => {

    frameCount++;

    if (now - lastTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = now;

      console.log(`FPS: ${fps}`);
    }

      fn(now);
      window.requestAnimationFrame(loop);
  };

    window.requestAnimationFrame(loop);
}
