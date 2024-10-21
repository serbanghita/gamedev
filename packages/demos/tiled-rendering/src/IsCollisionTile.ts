import { Component } from "@serbanghita-gamedev/ecs";
import { Point } from "@serbanghita-gamedev/geometry";

export interface IsCollisionTileProps {
  x: number;
  y: number;
  point: Point;
  // Tile index.
  tile: number;
}

export default class IsCollisionTile extends Component {
  constructor(public properties: IsCollisionTileProps) {
    super(properties);
  }
}
