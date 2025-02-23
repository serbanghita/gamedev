import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";

export default class Idle extends Component {
  public stateName: string = 'idle';
  public animationStateName: string = 'idle_down';
  public animationTick: number = 0;
  public status: StateStatus = StateStatus.NOT_STARTED;

  public init() {
    this.animationTick = 0;
    this.status = StateStatus.STARTED;
  }
}
