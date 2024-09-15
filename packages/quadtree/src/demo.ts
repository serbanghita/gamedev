import {createCanvas, createWrapperElement, renderRectangle, renderCircle, run} from "@serbanghita-gamedev/renderer";
import QuadTree from "./QuadTree";
import {Rectangle, Point} from "@serbanghita-gamedev/geometry";

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
document.body.appendChild(HTML_WRAPPER);

const area = new Rectangle(640, 480, new Point(640/2, 480/2));
const quadtree = new QuadTree(area, 3, 3);

// for (let i = 0; i<10; i++) {
//     const point = new Point(randomInt(10, 600), randomInt(10, 400));
//     quadtree.candidatePoint(point);
// }

// Case 1. (only one root quadrant).
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
// ];

// // Case 2. (4 quadrants)
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
//
//     [400, 50],
//     [400, 70],
//     [400, 80],
//
//     [100, 450],
//     [100, 470],
//     [100, 480],
//
//     [400, 450],
//     [400, 470],
//     [400, 480],
// ];

// Case 3.
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
//     [200, 80]
// ];

// Case 4.
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
//     [200, 80],
//     [210, 80],
//     [220, 80],
//     [230, 80]
// ];
// //
// points.forEach((arr) => {
//     const point = new Point(arr[0], arr[1]);
//     quadtree.candidatePoint(point);
// });

/**
 * Render for demo
 */
const ctx = CANVAS_BACKGROUND.getContext('2d') as CanvasRenderingContext2D;

function renderQuadTree(quadtree: QuadTree) {
    renderRectangle(ctx, quadtree.area.topLeftX, quadtree.area.topLeftY, quadtree.area.width, quadtree.area.height, 'black');

    quadtree.points.forEach((point) => {
        renderCircle(ctx, point.x, point.y, 2, 'red');
    });

    quadtree.quadrants.forEach((subQuadtree) => {
        renderQuadTree(subQuadtree);
    });
}

// renderQuadTree(quadtree)

console.log(quadtree);

let allowDraw = false;

CANVAS_BACKGROUND.addEventListener('mousedown', () =>  allowDraw = true);
CANVAS_BACKGROUND.addEventListener('mouseup', () =>  allowDraw = false);


CANVAS_BACKGROUND.addEventListener('mousemove', (event) => {
    if (!allowDraw) { return false; }
    const x = event.clientX | 0;
    const y = event.clientY | 0;
    console.log(x, y);
    const point = new Point(x, y);
    quadtree.candidatePoint(point);
});

run(() => { ctx.clearRect(0, 0, 640, 480); renderQuadTree(quadtree);});

