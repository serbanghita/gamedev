import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";

export interface IdleProps {
  stateName: string;
  animationStateName: string;
  animationTick: number;
  status: StateStatus;
  lastFrameTime: DOMHighResTimeStamp;
}

export class Idle extends Component<IdleProps> {
  static defaultProps = {
    stateName: 'idle',
    animationStateName: 'idle_down',
    animationTick: 0,
    status: StateStatus.STARTED,
    lastFrameTime: 0,
  };

  public constructor(props: IdleProps) {
    super(props);

    this.init();
  }

  public init() {
    this.properties = {...Idle.defaultProps};
  }
}
