export type PointDTO = {
  x: number;
  y: number;
}
export default class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
  }

  public intersects(point: Point) {
      return this.x === point.x && this.y === point.y;
  }
}
