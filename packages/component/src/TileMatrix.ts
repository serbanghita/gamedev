import { Component } from "@serbanghita-gamedev/ecs";

export interface TileMatrixProps {
  // Flat array matrix with all the possible entities, obstacles, etc.
  matrix: number[];
  // Width in tiles.
  width: number;
  // Height in tiles.
  height: number;
  // Size of the tile in pixels.
  tileSize: number;
}

export default class TileMatrix extends Component {
  constructor(public properties: TileMatrixProps) {
    super(properties);
  }
}
