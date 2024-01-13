export function createWrapperElement(layerId: string, width?: number, height?: number) {
    const $elem = document.createElement("div");
    $elem.id = layerId;
    $elem.setAttribute("tabindex", "0");
    if (width && height) {
        $elem.setAttribute("style", `width: ${width}px; height: ${height}px;`);
    }
    return $elem;
}