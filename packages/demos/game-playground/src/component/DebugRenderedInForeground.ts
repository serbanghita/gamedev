import { Component } from "@serbanghita-gamedev/ecs";

export default class DebugRenderedInForeground extends Component<Record<string, never>> {
  constructor(public properties: Record<string, never>) {
    super(properties);
  }
}
