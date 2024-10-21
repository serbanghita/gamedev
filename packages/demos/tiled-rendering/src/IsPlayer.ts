import { Component } from "@serbanghita-gamedev/ecs";

export default class IsPlayer extends Component {
  constructor(public properties: Record<string, never>) {
    super(properties);
  }
}
