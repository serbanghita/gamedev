import { Component } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";
import { extend } from "../utils";

export default class Walking extends Component {
  public stateName: string = 'walking';
  public animationStateName: string = 'walk_down';
  public animationTick: number = 0;
  public status: StateStatus = StateStatus.NOT_STARTED;
  public lastFrameTime: DOMHighResTimeStamp = 0;

  public init() {
    this.animationTick = 0;
    this.status = StateStatus.STARTED;
  }
}
