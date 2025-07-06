import { Component } from "@serbanghita-gamedev/ecs";

export default class TileToBeExplored extends Component {
  public fCost: number = 0;

  constructor(public properties: { fCost: number }) {
    super(properties);

    this.fCost = properties.fCost;
  }
}
