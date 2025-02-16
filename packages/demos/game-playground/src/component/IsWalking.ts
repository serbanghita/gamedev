import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";
import { extend } from "../utils";

interface IsWalkingProps {
  stateName: string;
  animationStateName: string;
  animationTick: number;
  tick: number;
  status: StateStatus;
  [key: string]: unknown;
}

export default class IsWalking extends Component {
  constructor(public properties: IsWalkingProps) {
    super(properties);

    this.init(properties);
  }

  public init(properties: IsWalkingProps) {
    const defaultProps = {
      stateName: "walking",
      animationStateName: "walk_down",
      animationTick: 0,
      tick: 0,
      status: StateStatus.NOT_STARTED,
    };

    this.properties = extend(defaultProps, properties);
  }
}
