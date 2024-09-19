import { Rectangle, Point } from "@serbanghita-gamedev/geometry";
import QuadTree from "./QuadTree";

describe("QuadTree", () => {
  it("1 quadtree with maxPoints", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const q = new QuadTree(area, 3, 3);

    q.candidatePoint(new Point(10, 50));
    q.candidatePoint(new Point(10, 70));
    q.candidatePoint(new Point(10, 80));

    expect(q.hasQuadrants).toBe(false);
    expect(q.points.length).toEqual(3);
    expect(q.quadrants.length).toEqual(0);
  });

  it("4 quadtrees leafs with maxPoints", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const rootQuadTree = new QuadTree(area, 3, 3);

    rootQuadTree.candidatePoint(new Point(10, 50));
    rootQuadTree.candidatePoint(new Point(10, 70));
    rootQuadTree.candidatePoint(new Point(10, 80));

    rootQuadTree.candidatePoint(new Point(400, 50));
    rootQuadTree.candidatePoint(new Point(400, 70));
    rootQuadTree.candidatePoint(new Point(400, 80));

    rootQuadTree.candidatePoint(new Point(100, 450));
    rootQuadTree.candidatePoint(new Point(100, 470));
    rootQuadTree.candidatePoint(new Point(100, 480));

    rootQuadTree.candidatePoint(new Point(400, 450));
    rootQuadTree.candidatePoint(new Point(400, 470));
    rootQuadTree.candidatePoint(new Point(400, 480));

    expect(rootQuadTree.hasQuadrants).toBe(true);
    expect(rootQuadTree.points.length).toEqual(0);
    expect(rootQuadTree.quadrants.length).toEqual(4);

    expect(rootQuadTree.quadrants[0].points.length).toEqual(3);
    expect(rootQuadTree.quadrants[0].hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants[1].points.length).toEqual(3);
    expect(rootQuadTree.quadrants[1].hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants[2].points.length).toEqual(3);
    expect(rootQuadTree.quadrants[2].hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants[3].points.length).toEqual(3);
    expect(rootQuadTree.quadrants[3].hasQuadrants).toBe(false);
  });

  it("3 level quadrants, points belong to the lowest level quadrants", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const rootQuadTree = new QuadTree(area, 3, 3);

    rootQuadTree.candidatePoint(new Point(100, 50));
    rootQuadTree.candidatePoint(new Point(100, 70));
    rootQuadTree.candidatePoint(new Point(100, 80));
    rootQuadTree.candidatePoint(new Point(200, 80));

    expect(rootQuadTree.hasQuadrants).toBe(true);
    expect(rootQuadTree.points.length).toEqual(0);
    expect(rootQuadTree.quadrants.length).toEqual(4);

    expect(rootQuadTree.quadrants[0].points.length).toEqual(0);
    expect(rootQuadTree.quadrants[0].hasQuadrants).toBe(true);

    expect(rootQuadTree.quadrants[0].quadrants[0].points.length).toBe(3);
    expect(rootQuadTree.quadrants[0].quadrants[1].points.length).toBe(1);
    expect(rootQuadTree.quadrants[0].quadrants[2].points.length).toBe(0);
    expect(rootQuadTree.quadrants[0].quadrants[3].points.length).toBe(0);
  });

  it("maxDepth", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const rootQuadTree = new QuadTree(area, 3, 1);

    rootQuadTree.candidatePoint(new Point(10, 10));
    rootQuadTree.candidatePoint(new Point(10, 20));
    rootQuadTree.candidatePoint(new Point(10, 30));
    rootQuadTree.candidatePoint(new Point(10, 40));
    rootQuadTree.candidatePoint(new Point(10, 50));

    expect(rootQuadTree.hasQuadrants).toBe(true);
    expect(rootQuadTree.depth).toEqual(0);
    expect(rootQuadTree.points.length).toEqual(0);
    expect(rootQuadTree.quadrants.length).toEqual(4);

    expect(rootQuadTree.quadrants[0].hasQuadrants).toBe(true);
    expect(rootQuadTree.quadrants[0].depth).toEqual(1);
    expect(rootQuadTree.quadrants[0].points.length).toEqual(0);
    expect(rootQuadTree.quadrants[0].quadrants.length).toEqual(4);

    expect(rootQuadTree.quadrants[0].quadrants[0].hasQuadrants).toBe(true);
    expect(rootQuadTree.quadrants[0].quadrants[0].depth).toEqual(2);
    expect(rootQuadTree.quadrants[0].quadrants[0].points.length).toEqual(0);
    expect(rootQuadTree.quadrants[0].quadrants[0].quadrants.length).toEqual(4);

    expect(rootQuadTree.quadrants[0].quadrants[0].quadrants[0].hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants[0].quadrants[0].quadrants[0].depth).toEqual(3);
    expect(rootQuadTree.quadrants[0].quadrants[0].quadrants[0].points.length).toEqual(5);
    expect(rootQuadTree.quadrants[0].quadrants[0].quadrants[0].quadrants.length).toEqual(0);
  });
});
