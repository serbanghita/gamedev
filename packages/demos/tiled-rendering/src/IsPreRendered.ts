import { Component } from "@serbanghita-gamedev/ecs";

export default class IsPreRendered extends Component {
  constructor(public properties: Record<string, never>) {
    super(properties);
  }
}
