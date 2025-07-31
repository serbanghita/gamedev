import {Component} from "@serbanghita-gamedev/ecs";

export type AutoMovingProps = {
  destinationX: number;
  destinationY: number;
}

export default class AutoMoving extends Component<AutoMovingProps> {
  constructor(public properties: AutoMovingProps) {
    super(properties);
  }

  public get destinationX(): number {
    return this.properties.destinationX;
  }

  public get destinationY(): number {
    return this.properties.destinationY;
  }

  public setDestination(x: number, y: number) {
    this.properties.destinationX = x;
    this.properties.destinationY = y;
  }

  public clearDestination() {
    this.properties.destinationX = 0;
    this.properties.destinationY = 0;
  }

  public hasDestination(): boolean {
    return !!this.properties.destinationX && !!this.properties.destinationY;
  }
}