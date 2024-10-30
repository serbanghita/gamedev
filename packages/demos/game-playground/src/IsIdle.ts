import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "./state";
import { extend } from "./utils";

interface IsIdleProps {
  stateName: string;
  animationStateName: string;
  animationTick: number;
  tick: number;
  status: StateStatus;
  [key: string]: any;
}

export default class IsIdle extends Component {
  constructor(public properties: IsIdleProps) {
    super(properties);

    this.init(properties);
  }

  public init(properties: IsIdleProps) {
    const defaultProps = {
      stateName: "idle",
      animationStateName: "idle_down",
      animationTick: 0,
      tick: 0,
      status: StateStatus.NOT_STARTED,
    };

    this.properties = extend(defaultProps, properties);
  }
}
