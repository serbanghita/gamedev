import { Component } from "@serbanghita-gamedev/ecs";

export type PositionOnScreenProps = {
  x: number;
  y: number;
};

export default class PositionOnScreen extends Component<PositionOnScreenProps> {

  constructor(public properties: PositionOnScreenProps) {
    super(properties);
  }

  public get x(): number {
    return this.properties.x;
  }

  public get y(): number {
    return this.properties.y;
  }

  public setXY(x: number, y: number) {
    this.properties.x = x;
    this.properties.y = y;
  }
}
