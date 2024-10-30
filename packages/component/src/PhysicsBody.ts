import { Component } from "@serbanghita-gamedev/ecs";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";

export interface PhysicsBodyProps {
  width: number;
  height: number;
  x: number;
  y: number;
  rectangle: Rectangle;
  point: Point;
}

export type PhysicsBodyPropsDeclaration = Exclude<PhysicsBodyProps, { rectangle: Rectangle; point: Point }>;

export default class PhysicsBody extends Component {
  constructor(public properties: PhysicsBodyProps) {
    super(properties);
  }
}
