import RenderingStateComponent from "./common/RenderingStateComponent";

export class Idle extends RenderingStateComponent {
  static defaultProps = {
    ...super.defaultProps,
    stateName: 'idle',
    animationStateName: 'idle_down',
    isContinuous: true
  };

  public init() {
    this.properties = {...Idle.defaultProps};
  }
}
