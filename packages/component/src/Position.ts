import { Component } from "@serbanghita-gamedev/ecs";
import { Point } from "@serbanghita-gamedev/geometry";

export type PositionProps = {
  x: number;
  y: number;
  point: Point;
};

export default class Position extends Component {
  constructor(public properties: PositionProps) {
    super(properties);

    properties.point = new Point(properties.x, properties.y);
  }
}
