import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "./state";
import { extend } from "./utils";

interface IsAttackingWithClubProps {
  stateName: string;
  animationStateName: string;
  animationTick: number;
  tick: number;
  status: StateStatus;
  [key: string]: any;
}

export default class IsAttackingWithClub extends Component {
  constructor(public properties: IsAttackingWithClubProps) {
    super(properties);

    this.init(properties);
  }

  public init(properties: IsAttackingWithClubProps) {
    const defaultProps = {
      stateName: "club_attack_one",
      animationStateName: "club_attack_one_down",
      animationTick: 0,
      tick: 0,
      status: StateStatus.NOT_STARTED,
    };

    this.properties = extend(defaultProps, properties);
  }
}
