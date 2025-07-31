import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";

export interface AttackingWithClubProps {
  stateName: string;
  animationStateName: string;
  animationTick: number;
  status: StateStatus;
  lastFrameTime: DOMHighResTimeStamp;
}

export default class AttackingWithClub extends Component<AttackingWithClubProps> {
  public constructor(props: AttackingWithClubProps) {
    super(props);

    this.init();
  }

  public init() {
    this.properties.stateName = 'club_attack_one';
    this.properties.animationStateName = 'club_attack_one_down';
    this.properties.animationTick = 0;
    this.properties.status = StateStatus.NOT_STARTED;
    this.properties.lastFrameTime = 0;
  }
}