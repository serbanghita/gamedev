import QuadTree from "./QuadTree";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";
import { bench, describe } from "vitest";

let area: Rectangle, quadtree: QuadTree, queryArea: Rectangle;

function beforeEachTest() {
  area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
  quadtree = new QuadTree(area, 5, 10);
  for (let x = 0; x < 640 / 2; x += 6) {
    for (let y = 0; y < 480 / 2; y += 6) {
      quadtree.addPoint(new Point(x, y));
    }
  }
  queryArea = new Rectangle(200, 200, new Point(640 / 2, 480 / 2));
}

describe("queryArea", () => {
  beforeEachTest();

  bench(
    "normal",
    () => {
      quadtree.query(queryArea);
    },
    { iterations: 10000, warmupIterations: 10000 },
  );
});
