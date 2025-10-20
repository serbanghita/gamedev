import { Component } from "@serbanghita-gamedev/ecs";
import { Animation } from "@serbanghita-gamedev/component";

export interface RenderingStateProps {
  stateName: string;
  animationStateName: string;
  animation: Animation,
  animationTick: number;
  animationTime: number;
  isPlaying: boolean;
  hasFinished: boolean;
  isContinuous: boolean;

}

export default class RenderingStateComponent extends Component<RenderingStateProps> {
  public static defaultProps = {
    stateName: '',
    animationStateName: '',
    animation: {} as Animation,
    animationTick: 0,
    animationTime: 0,
    isPlaying: true,
    hasFinished: false,
    isContinuous: false,
  };

  public constructor(props: RenderingStateProps) {
    super(props);

    this.init();
  }

  public init() {
    throw new Error(`Please implement init in ${super.constructor.name}`);
  }
}