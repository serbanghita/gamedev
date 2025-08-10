import { Component } from "@serbanghita-gamedev/ecs";

export default class NPC extends Component<{}> {
  constructor(public properties: {}) {
    super(properties);
  }
}
