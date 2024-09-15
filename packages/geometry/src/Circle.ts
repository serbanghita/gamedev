import Point from "./Point";
import Rectangle from "./Rectangle";

export default class Circle {
    public radius: number;
    public center: Point;

    constructor(center: Point, radius: number) {
        this.center = center;
        this.radius = radius;
    }

    public init(x: number, y: number, radius: number) {
      this.center.x = x;
      this.center.y = y;
      this.radius = radius;
    }

    public intersects(circle: Circle): boolean {
      const dx = this.center.x - circle.center.x;
      const dy = this.center.y - circle.center.y;

      return Math.sqrt(dx * dx + dy * dy) <= (this.radius + circle.radius);
    }

    public intersectsWithPoint(point: Point): boolean {
      const x1 = Math.abs(this.center.x - point.x);
      const y1 = Math.abs(this.center.y - point.y);

      const d = Math.sqrt( x1 * x1 + y1 * y1 );
      return d <= this.radius;
    }

    public intersectsWithRectangle(rect: Rectangle): boolean {
      const distX = Math.abs(this.center.x - rect.topLeftX-rect.width/2);
      const distY = Math.abs(this.center.y - rect.topLeftY-rect.height/2);

      if (distX > (rect.width/2 + this.radius)) { return false; }
      if (distY > (rect.height/2 + this.radius)) { return false; }

      if (distX <= (rect.width/2)) { return true; }
      if (distY <= (rect.height/2)) { return true; }

      const dx=distX-rect.width/2;
      const dy=distY-rect.height/2;
      return (dx*dx+dy*dy<=(this.radius*this.radius));
    }
}
