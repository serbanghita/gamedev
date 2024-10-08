import { Rectangle, Point } from "@serbanghita-gamedev/geometry";

/**
 * @todo: Add perf tests, add FPS counter, extend Point to attach optional entity id so I can use it in a System
 */

export type Quadrants = {
  topLeft?: QuadTree;
  topRight?: QuadTree;
  bottomLeft?: QuadTree;
  bottomRight?: QuadTree;
};

type QuadrantEntries = [keyof Quadrants, QuadTree][];

export default class QuadTree {
  public points: Point[] = [];
  public quadrants: Quadrants = {};
  public hasQuadrants: boolean = false;

  constructor(
    public readonly area: Rectangle,
    // Maximum depth of the root quad tree.
    public readonly maxDepth: number,
    // Maximum points per tree before being split into 4.
    public readonly maxPoints: number,

    public readonly depth: number = 0,
  ) {}

  private createQuadrants(): Quadrants {
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

    return { topLeft, topRight, bottomLeft, bottomRight };
  }

  private candidatePoint(point: Point) {
    return this.area.intersectsWithPoint(point);
  }

  public addPoint(point: Point): boolean {
    if (!this.candidatePoint(point)) {
      return false;
    }

    this.points.push(point);

    // Attempt to split the points in quadrants only if we didn't reach the maximum depth.
    // Do not keep points into quadrants if there are existing sub-quadrants.
    if (this.hasQuadrants || (this.points.length > this.maxPoints && this.depth < this.maxDepth)) {
      this.redistributePoints();
      this.clearPoints();
    }

    return true;
  }

  private redistributePoints() {
    // Create temporary sub-quadrants objects to check if there are points in them.
    const quadrants = this.createQuadrants();

    // Iterate through available points and distribute them to sub-quadrants.
    this.points.forEach((point: Point) => {
      for (const [key, quadrant] of Object.entries(quadrants) as QuadrantEntries) {
        const searchInQuadrant = this.quadrants[key] ?? quadrant;

        if (searchInQuadrant.candidatePoint(point)) {
          // Save the quadrant for later use. Don't save empty quadrants.
          if (!this.quadrants[key]) {
            this.quadrants[key] = quadrant;
          }

          this.quadrants[key]?.addPoint(point);
          // Point is assigned to the first quadrant that it intersects with.
          // This prevents duplication in searches but this could also be a feature (depending on use-cases).
          break;
        }
      }
    });

    if (Object.keys(this.quadrants).length > 0) {
      this.hasQuadrants = true;
    }
  }

  public clearPoints() {
    this.points = [];
  }

  public query(area: Rectangle): Point[] {
    if (!this.area.intersects(area)) {
      return [];
    }

    if (this.points.length === 0) {
      return Object.values(this.quadrants).reduce<Point[]>((acc, quadrant) => {
        return acc.concat(quadrant.query(area));
      }, []);
    }

    return this.points.filter((point) => area.intersectsWithPoint(point));
  }

  private clearQuadrants() {
    this.hasQuadrants = false;
    this.quadrants = {};
  }

  public clear() {
    this.clearPoints();
    this.clearQuadrants();
  }
}
