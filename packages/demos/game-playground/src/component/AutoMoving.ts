import {Component} from "@serbanghita-gamedev/ecs";

export type AutoMovingInitProps = {
  destinationX: number;
  destinationY: number;
}

export default class AutoMoving extends Component {
  public destinationX: number = 0;
  public destinationY: number = 0;

  constructor(public properties: AutoMovingInitProps) {
    super(properties);

    this.init(properties);
  }

  public init(properties: AutoMovingInitProps) {
    this.destinationX = properties.destinationX;
    this.destinationY = properties.destinationY;
  }

  public setDestination(x: number, y: number) {
    this.destinationX = x;
    this.destinationY = y;
  }

  public hasNoDestination(): boolean {
    return !this.destinationX && !this.destinationY;
  }
}