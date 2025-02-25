import {Component} from "@serbanghita-gamedev/ecs";

export type AutoMovingInitProps = {
  destinationX: number;
  destinationY: number;
}

export default class AutoMoving extends Component {
  constructor(public properties: AutoMovingInitProps) {
    super(properties);
  }
}