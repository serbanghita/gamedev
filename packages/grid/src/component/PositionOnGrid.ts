import { Component } from "@serbanghita-gamedev/ecs";

export type PositionOnGridProps = {
  x: number;
  y: number;
};

export default class PositionOnGrid extends Component<PositionOnGridProps> {

  constructor(public properties: PositionOnGridProps) {
    super(properties);
  }

  public setXY(x: number, y: number) {
    this.properties.x = x;
    this.properties.y = y;
  }

  public get x(): number {
    return this.properties.x;
  }

  public get y(): number {
    return this.properties.y;
  }
}
