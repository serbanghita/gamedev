import { Component } from "@serbanghita-gamedev/ecs";
import { Point } from "@serbanghita-gamedev/geometry";
import Grid from "./Grid";
import { getPixelCoordinatesFromTile, getTileFromGridCoordinates } from "../utils";

export enum GridTileType {
  FREE = 0,
  BLOCKED = 1,
  DESTRUCTIBLE = 2,
  BLOCKED_FOR_AI = 3,
}

export interface GridTileInitProps {
  x: number; // x on grid (not canvas)
  y: number; // y on grid (not canvas)
  tile: number; // the tile index on grid
  type: GridTileType;
}

export default class GridTile extends Component {
  public x!: number;
  public y!: number;
  public tile!: number;
  public type!: GridTileType;

  constructor(public properties: GridTileInitProps) {
    super(properties);
    this.init(properties);
  }

  public init(properties: GridTileInitProps) {
    this.x = properties.x;
    this.y = properties.y;
    this.tile = properties.tile;
    this.type = properties.type;
  }

  // public get tile(): number {
  //   return getTileFromGridCoordinates(this.point.x, this.point.y, this.grid.config);
  // }
  //
  // public getGridCoordinates(): {x : number, y: number } {
  //   return { x: this.point.x, y: this.point.y };
  // }
  //
  // public getPixelCoordinates(): {x: number, y: number } {
  //   return { x: this.point.x * this.grid.tileSize, y: this.point.y * this.grid.tileSize };
  // }
}
