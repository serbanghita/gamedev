import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";

export default class AttackingWithClub extends Component {

  public stateName: string = 'club_attack_one';
  public animationStateName: string = 'club_attack_one_down';
  public animationTick: number = 0;
  public status: StateStatus = StateStatus.NOT_STARTED;

  public init() {
    this.animationTick = 0;
    this.status = StateStatus.STARTED;
  }
}
