import { Component } from "@serbanghita-gamedev/ecs";
import { Point } from "@serbanghita-gamedev/geometry";

export type PositionInitProps = {
  x: number;
  y: number;
};

export default class Position extends Component {
  public point: Point;

  constructor(public properties: PositionInitProps) {
    super(properties);

    this.point = new Point(properties.x, properties.y);
  }
}
