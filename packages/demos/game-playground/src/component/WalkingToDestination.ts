import {Component} from "@serbanghita-gamedev/ecs";

export type WalkingToDestinationProps = {
  destinationX: number;
  destinationY: number;
}

export default class WalkingToDestination extends Component<WalkingToDestinationProps> {
  constructor(public properties: WalkingToDestinationProps) {
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