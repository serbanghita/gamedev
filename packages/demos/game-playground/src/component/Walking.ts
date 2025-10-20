import RenderingStateComponent from "./common/RenderingStateComponent";

export class Walking extends RenderingStateComponent {
  static defaultProps = {
    ...super.defaultProps,
    stateName: 'walk',
    animationStateName: 'walk_down',
    isContinuous: true
  };

  public init() {
    this.properties = {...Walking.defaultProps};
  }
}
