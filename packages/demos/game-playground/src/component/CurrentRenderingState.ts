import { Component } from "@serbanghita-gamedev/ecs";
import RenderingStateComponent from "./common/RenderingStateComponent";

export type CurrentRenderingStateProps = {
  // Current mutually exclusive state component.
  component: typeof RenderingStateComponent
}

export default class CurrentRenderingState extends Component<CurrentRenderingStateProps> {
  constructor(public properties: CurrentRenderingStateProps) {
    super(properties);
  }

  public setComponent(componentDeclaration: typeof RenderingStateComponent) {
    this.properties.component = componentDeclaration;
  }
}
