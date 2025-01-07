import {Component} from "@serbanghita-gamedev/ecs";

export type IsAutoMovingProps = {
  destinationX: number;
  destinationY: number;
}

export default class IsAutoMoving extends Component {
  constructor(public properties: IsAutoMovingProps) {
    super(properties);
  }
}