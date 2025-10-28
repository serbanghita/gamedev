import RenderingStateComponent from "./common/RenderingStateComponent";


export default class AttackingWithClub extends RenderingStateComponent {
  static defaultProps = {
    ...super.defaultProps,
    stateName: 'club_attack_one',
    animationStateName: 'club_attack_one_down'
  };

  public init() {
    this.properties = {...AttackingWithClub.defaultProps};
  }
}