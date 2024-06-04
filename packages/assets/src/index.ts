export function loadLocalImage(data: string) {
    const img = new Image();
    const test1 = data.match(/([a-z0-9-_]+).(png|gif|jpg)$/i);
    const test2 = data.match(/^data:image\//i);
    if (!test1 && !test2) {
        throw new Error(`Trying to an load an invalid image ${data}.`);
    }

    img.src = data;
    return img;
}