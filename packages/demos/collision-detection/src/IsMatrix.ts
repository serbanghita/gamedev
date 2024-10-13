import { Component } from "@serbanghita-gamedev/ecs";

export interface IsMatrixProps {
  // Flat array matrix with all the possible entities, obstacles, etc.
  matrix: number[];
  // Width in tiles.
  width: number;
  // Height in tiles.
  height: number;
  // Size of the tile in pixels.
  tileSize: number;
}

export default class IsMatrix extends Component {
  constructor(public properties: IsMatrixProps) {
    super(properties);
  }
}
