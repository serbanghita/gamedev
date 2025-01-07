import Point from "./Point";

export default class Rectangle {
  public width: number;
  public height: number;
  public area: number;

  public center: Point;

  constructor(width: number, height: number, center: Point) {
    this.width = width;
    this.height = height;
    this.center = center;
    this.area = width * height;
  }

  public init(width: number, height: number, centerX: number, centerY: number) {
    this.width = width;
    this.height = height;
    this.center.x = centerX;
    this.center.y = centerY;
    this.area = width * height;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.area = width * height;
  }

  public moveCenterTo(x: number, y: number) {
    this.center.x = x;
    this.center.y = y;
  }

  public moveCenterBy(deltaX: number, deltaY: number) {
    this.center.x += deltaX;
    this.center.y += deltaY;
  }

  get topLeftX() {
    return this.center.x - this.width / 2;
  }

  get topLeftY() {
    return this.center.y - this.height / 2;
  }

  get topRightX() {
    return this.center.x + this.width / 2;
  }

  get topRightY() {
    return this.center.y - this.height / 2;
  }

  get bottomLeftX() {
    return this.center.x - this.width / 2;
  }

  get bottomLeftY() {
    return this.center.y + this.height / 2;
  }

  get bottomRightX() {
    return this.center.x + this.width / 2;
  }

  get bottomRightY() {
    return this.center.y + this.height / 2;
  }

  public intersects(rectangle: Rectangle) {
    return !(this.topRightX < rectangle.topLeftX || this.bottomLeftY < rectangle.topLeftY || this.topLeftX > rectangle.topRightX || this.topLeftY > rectangle.bottomLeftY);
  }

  public intersectsWithPoint(point: Point): boolean {
    return point.x >= this.topLeftX && point.x <= this.topRightX && point.y >= this.topLeftY && point.y <= this.bottomLeftY;
  }
}
