import { Rectangle, Point } from "@serbanghita-gamedev/geometry";
import QuadTree from "./QuadTree";

describe("QuadTree", () => {
  it("addPoint outside the area", () => {
    const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
    const q = new QuadTree(area, 3, 3);

    expect(q.addPoint(new Point(1000, 1000))).toBe(false);
  });

  it("misplaced Points are note redistributed", () => {
    const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
    const q = new QuadTree(area, 3, 3);
    q.points = [new Point(1000, 1000), new Point(2000, 2000), new Point(3000, 3000), new Point(4000, 4000)];

    q.addPoint(new Point(100, 100));

    expect(q.query(area)).toHaveLength(1);
  });

  it("1 quadtree with maxPoints", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const q = new QuadTree(area, 3, 3);

    q.addPoint(new Point(10, 50));
    q.addPoint(new Point(10, 70));
    q.addPoint(new Point(10, 80));

    expect(q.hasQuadrants).toBe(false);
    expect(q.points).toHaveLength(3);
    expect(q.quadrants).toEqual({});
  });

  it("4 sub quadtrees with maxPoints", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const rootQuadTree = new QuadTree(area, 3, 3);

    rootQuadTree.addPoint(new Point(10, 50));
    rootQuadTree.addPoint(new Point(10, 70));
    rootQuadTree.addPoint(new Point(10, 80));

    rootQuadTree.addPoint(new Point(400, 50));
    rootQuadTree.addPoint(new Point(400, 70));
    rootQuadTree.addPoint(new Point(400, 80));

    rootQuadTree.addPoint(new Point(100, 450));
    rootQuadTree.addPoint(new Point(100, 470));
    rootQuadTree.addPoint(new Point(100, 480));

    rootQuadTree.addPoint(new Point(400, 450));
    rootQuadTree.addPoint(new Point(400, 470));
    rootQuadTree.addPoint(new Point(400, 480));

    expect(rootQuadTree.hasQuadrants).toBe(true);
    expect(rootQuadTree.points).toHaveLength(0);

    expect(rootQuadTree.quadrants.topLeft?.points).toHaveLength(3);
    expect(rootQuadTree.quadrants.topLeft?.hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants.topRight?.points).toHaveLength(3);
    expect(rootQuadTree.quadrants.topRight?.hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants.bottomLeft?.points).toHaveLength(3);
    expect(rootQuadTree.quadrants.bottomLeft?.hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants.bottomRight?.points).toHaveLength(3);
    expect(rootQuadTree.quadrants.bottomRight?.hasQuadrants).toBe(false);
  });

  it("3 level quadrants, points belong to the lowest level quadrants", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const rootQuadTree = new QuadTree(area, 3, 3);

    rootQuadTree.addPoint(new Point(100, 50));
    rootQuadTree.addPoint(new Point(100, 70));
    rootQuadTree.addPoint(new Point(100, 80));
    rootQuadTree.addPoint(new Point(200, 80));

    expect(rootQuadTree.hasQuadrants).toBe(true);
    expect(rootQuadTree.points).toHaveLength(0);
    expect(rootQuadTree.quadrants).toHaveProperty("topLeft");
    expect(rootQuadTree.quadrants).not.toHaveProperty("topRight");
    expect(rootQuadTree.quadrants).not.toHaveProperty("bottomLeft");
    expect(rootQuadTree.quadrants).not.toHaveProperty("bottomRight");

    expect(rootQuadTree.quadrants.topLeft?.points).toHaveLength(0);
    expect(rootQuadTree.quadrants.topLeft?.hasQuadrants).toBe(true);

    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.points).toHaveLength(3);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topRight?.points).toHaveLength(1);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.bottomLeft).toBeUndefined();
    expect(rootQuadTree.quadrants.topLeft?.quadrants.bottomRight).toBeUndefined();
  });

  it("maxDepth", () => {
    const areaCenterPoint = new Point(640 / 2, 480 / 2);
    const area = new Rectangle(640, 480, areaCenterPoint);
    const rootQuadTree = new QuadTree(area, 3, 1);

    rootQuadTree.addPoint(new Point(10, 10));
    rootQuadTree.addPoint(new Point(10, 20));
    rootQuadTree.addPoint(new Point(10, 30));
    rootQuadTree.addPoint(new Point(10, 40));
    rootQuadTree.addPoint(new Point(10, 50));

    expect(rootQuadTree.hasQuadrants).toBe(true);
    expect(rootQuadTree.depth).toEqual(0);
    expect(rootQuadTree.points.length).toEqual(0);
    expect(rootQuadTree.quadrants).toHaveProperty("topLeft");
    expect(rootQuadTree.quadrants).not.toHaveProperty("topRight");
    expect(rootQuadTree.quadrants).not.toHaveProperty("bottomLeft");
    expect(rootQuadTree.quadrants).not.toHaveProperty("bottomRight");

    expect(rootQuadTree.quadrants.topLeft?.hasQuadrants).toBe(true);
    expect(rootQuadTree.quadrants.topLeft?.depth).toEqual(1);
    expect(rootQuadTree.quadrants.topLeft?.points.length).toEqual(0);
    expect(rootQuadTree.quadrants.topLeft?.quadrants).toHaveProperty("topLeft");
    expect(rootQuadTree.quadrants.topLeft?.quadrants).not.toHaveProperty("topRight");
    expect(rootQuadTree.quadrants.topLeft?.quadrants).not.toHaveProperty("bottomLeft");
    expect(rootQuadTree.quadrants.topLeft?.quadrants).not.toHaveProperty("bottomRight");

    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.hasQuadrants).toBe(true);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.depth).toEqual(2);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.points.length).toEqual(0);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants).toHaveProperty("topLeft");
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants).not.toHaveProperty("topRight");
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants).not.toHaveProperty("bottomLeft");
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants).not.toHaveProperty("bottomRight");

    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants.topLeft?.hasQuadrants).toBe(false);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants.topLeft?.depth).toEqual(3);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants.topLeft?.points.length).toEqual(5);
    expect(rootQuadTree.quadrants.topLeft?.quadrants.topLeft?.quadrants.topLeft?.quadrants).toEqual({});
  });

  describe("query", () => {
    it("no quadrants, single point", async () => {
      const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
      const quadtree = new QuadTree(area, 5, 10);

      const points = [
        // Inside
        [270, 230],
      ];

      points.forEach(([x, y]) => quadtree.addPoint(new Point(x, y)));

      const pointsFound = quadtree.query(new Rectangle(120, 120, new Point(640 / 2, 480 / 2)));

      expect(quadtree.hasQuadrants).toBe(false);
      expect(quadtree.quadrants).toEqual({});
      expect(pointsFound).toHaveLength(1);
    });

    it("find 5 points", async () => {
      const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
      const quadtree = new QuadTree(area, 5, 3);

      const points = [
        // Outside
        [100, 100],
        [100, 110],
        [100, 120],
        [100, 130],
        [100, 140],
        // Inside
        [270, 230],
        [270, 240],
        [270, 250],
        [270, 260],
        [270, 270],
      ];

      points.forEach(([x, y]) => quadtree.addPoint(new Point(x, y)));

      const pointsFound = quadtree.query(new Rectangle(120, 120, new Point(640 / 2, 480 / 2)));

      expect(quadtree.hasQuadrants).toBe(true);
      expect(quadtree.quadrants).toHaveProperty("topLeft");
      expect(quadtree.quadrants).not.toHaveProperty("topRight");
      expect(quadtree.quadrants).toHaveProperty("bottomLeft");
      expect(quadtree.quadrants).not.toHaveProperty("bottomRight");
      expect(pointsFound).toHaveLength(5);
    });
  });
});
