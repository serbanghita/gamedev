import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";

export interface WalkingProps {
  stateName: string;
  animationStateName: string;
  animationTick: number;
  status: StateStatus;
  lastFrameTime: DOMHighResTimeStamp;
}

export class Walking extends Component<WalkingProps> {
  static defaultProps = {
    stateName: 'walking',
    animationStateName: 'walk_down',
    animationTick: 0,
    status: StateStatus.STARTED,
    lastFrameTime: 0,
  };

  public constructor(props: WalkingProps) {
    super(props);

    this.init();
  }

  public init() {
    this.properties = {...Walking.defaultProps};
  }
}
