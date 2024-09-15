import {Rectangle, Point} from "@serbanghita-gamedev/geometry";

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
      // @todo: Add logic based on this.
      public readonly depth: number = 0
  ) {

  }

  public candidatePoint(point: Point) {
    if (this.area.intersectsWithPoint(point)) {

      if (this.hasQuadrants) {
        this.quadrants.forEach((quadtree) => {
          quadtree.candidatePoint(point);
        });
        return true;
      }

      this.points.push(point);

      if (this.points.length > this.maxPoints) {
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
        new Rectangle(this.area.width/2, this.area.height/2, new Point(this.area.center.x - this.area.width/4, this.area.center.y - this.area.height/4)),
        this.maxDepth, this.maxPoints, this.depth + 1
    );
    const topRight = new QuadTree(
        new Rectangle(this.area.width/2, this.area.height/2, new Point(this.area.center.x + this.area.width/4, this.area.center.y - this.area.height/4)),
        this.maxDepth, this.maxPoints, this.depth + 1
    );
    const bottomLeft = new QuadTree(
        new Rectangle(this.area.width/2, this.area.height/2, new Point(this.area.center.x - this.area.width/4, this.area.center.y + this.area.height/4)),
        this.maxDepth, this.maxPoints, this.depth + 1
    );
    const bottomRight = new QuadTree(
        new Rectangle(this.area.width/2, this.area.height/2, new Point(this.area.center.x + this.area.width/4, this.area.center.y + this.area.height/4)),
        this.maxDepth, this.maxPoints, this.depth + 1
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

}