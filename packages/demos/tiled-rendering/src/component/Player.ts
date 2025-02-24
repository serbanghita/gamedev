import { Component } from "@serbanghita-gamedev/ecs";

export default class Player extends Component {
  constructor(public properties: Record<string, never>) {
    super(properties);
  }
}
