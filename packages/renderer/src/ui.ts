import {createCanvas} from "./canvas";

export function createWrapperElement(layerId: string, width?: number, height?: number) {
    const $elem = document.createElement("div");
    $elem.id = layerId;
    $elem.setAttribute("tabindex", "0");
    if (width && height) {
        $elem.setAttribute("style", `width: ${width}px; height: ${height}px;`);
    }
    return $elem;
}

type UiElements = [HTMLDivElement, HTMLCanvasElement, CanvasRenderingContext2D, HTMLCanvasElement, CanvasRenderingContext2D];

export function createHtmlUiElements(): UiElements {
  const $htmlWrapper = createWrapperElement("game-wrapper", 640, 480);
  const $canvasBackground = createCanvas("background", 640, 480, "1");
  const $ctxBackground = $canvasBackground.getContext('2d') as CanvasRenderingContext2D;
  const $canvasForeground = createCanvas("foreground", 640, 480, "2");
  const $ctxForeground = $canvasForeground.getContext('2d') as CanvasRenderingContext2D;

  $htmlWrapper.appendChild($canvasBackground);
  $htmlWrapper.appendChild($canvasForeground);

    document.body.appendChild($htmlWrapper);

    return [$htmlWrapper, $canvasBackground, $ctxBackground, $canvasForeground, $ctxForeground];
}
