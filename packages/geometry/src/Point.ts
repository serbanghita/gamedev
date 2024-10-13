export type PointDTO = {
  x: number;
  y: number;
  id: string;
};

export default class Point {
  constructor(
    // x coordinate in 2d space.
    public x: number,
    // y coordinate in 2d space.
    public y: number,
    // optional: unique string identifier.
    // This can bind the Point to an Entity, can be useful in Systems.
    public id?: string,
  ) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  public intersects(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}
