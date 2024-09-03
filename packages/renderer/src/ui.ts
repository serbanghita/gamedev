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
export function createHtmlUiElements() {
    const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
    const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
    const CANVAS_FOREGROUND = createCanvas("foreground", 640, 480, "2");

    HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
    HTML_WRAPPER.appendChild(CANVAS_FOREGROUND);

    document.body.appendChild(HTML_WRAPPER);

    return [HTML_WRAPPER, CANVAS_BACKGROUND, CANVAS_FOREGROUND];
}