import { Component } from "@serbanghita-gamedev/ecs";

export enum GridTileType {
  FREE = 0,
  BLOCKED = 1,
  DESTRUCTIBLE = 2,
  BLOCKED_FOR_AI = 3,
}

export interface GridTileProps {
  tile: number; // the tile index on grid
  type: GridTileType;
}

export default class GridTile extends Component<GridTileProps> {
  constructor(public properties: GridTileProps) {
    super(properties);
  }

  public get tile(): number {
    return this.properties.tile;
  }

  public get type(): GridTileType {
    return this.properties.type;
  }

  public setTile(tile: number): void {
    this.properties.tile = tile;
  }
}
