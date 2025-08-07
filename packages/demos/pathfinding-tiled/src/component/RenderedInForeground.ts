import { Component } from "@serbanghita-gamedev/ecs";

export default class RenderedInForeground extends Component<Record<string, never>> {
  constructor(public properties: Record<string, never>) {
    super(properties);
  }
}
