import { Component } from "@serbanghita-gamedev/ecs";

export interface TileProps {
  tile: number;
}

export default class Tile extends Component {
  constructor(public properties: TileProps) {
    super(properties);
  }
}
