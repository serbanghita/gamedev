import { Rectangle, Point } from "@serbanghita-gamedev/geometry";

/**
 * @todo: Add perf tests, add FPS counter, extend Point to attach optional entity id so I can use it in a System
 */

export default class QuadTree {
  public points: Point[] = [];
  public quadrants: QuadTree[] = [];
  public hasQuadrants: boolean = false;

  constructor(
    public readonly area: Rectangle,
    // Maximum depth of the root quad tree.
    public readonly maxDepth: number,
    // Maximum points per tree before being split into 4.
    public readonly maxPoints: number,

    public readonly depth: number = 0,
  ) {}

  public candidatePoint(point: Point) {
    if (this.area.intersectsWithPoint(point)) {
      if (this.hasQuadrants) {
        this.quadrants.forEach((quadtree) => {
          quadtree.candidatePoint(point);
        });
        return true;
      }

      this.points.push(point);

      // Attempt to split the points and quadrants only if we didn't reach the maximum depth.
      if (this.points.length > this.maxPoints && this.depth < this.maxDepth) {
        this.split();
        this.redistributePoints();
        this.clearPoints();
      }

      return true;
    }

    return false;
  }

  public split() {
    const topLeft = new QuadTree(
      new Rectangle(this.area.width / 2, this.area.height / 2, new Point(this.area.center.x - this.area.width / 4, this.area.center.y - this.area.height / 4)),
      this.maxDepth,
      this.maxPoints,
      this.depth + 1,
    );
    const topRight = new QuadTree(
      new Rectangle(this.area.width / 2, this.area.height / 2, new Point(this.area.center.x + this.area.width / 4, this.area.center.y - this.area.height / 4)),
      this.maxDepth,
      this.maxPoints,
      this.depth + 1,
    );
    const bottomLeft = new QuadTree(
      new Rectangle(this.area.width / 2, this.area.height / 2, new Point(this.area.center.x - this.area.width / 4, this.area.center.y + this.area.height / 4)),
      this.maxDepth,
      this.maxPoints,
      this.depth + 1,
    );
    const bottomRight = new QuadTree(
      new Rectangle(this.area.width / 2, this.area.height / 2, new Point(this.area.center.x + this.area.width / 4, this.area.center.y + this.area.height / 4)),
      this.maxDepth,
      this.maxPoints,
      this.depth + 1,
    );

    this.quadrants = [topLeft, topRight, bottomLeft, bottomRight];
    this.hasQuadrants = true;
  }

  // Redistribute points
  // Do not keep points to the root level if there are existing sub-quadrants.
  private redistributePoints() {
    this.points.forEach((point: Point) => {
      this.quadrants.some((subQuadrant) => {
        return subQuadrant.candidatePoint(point);
      });
    });
  }

  public clearPoints() {
    this.points = [];
  }

  public query(area: Rectangle): Point[] {
    if (!this.area.intersects(area)) {
      return [];
    }

    if (this.points.length === 0) {
      return this.quadrants.reduce<Point[]>((acc, quadrant) => {
        return acc.concat(quadrant.query(area));
      }, []);
    }

    return this.points.filter((point) => area.intersectsWithPoint(point));
  }
}
