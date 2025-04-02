import { Component } from "@serbanghita-gamedev/ecs";

export interface GridInitProps {
  // Flat array matrix with all the possible entities, obstacles, etc.
  matrix: number[];
  // Width in tiles.
  width: number;
  // Height in tiles.
  height: number;
  // Size of the tile in pixels.
  tileSize: number;
}

export default class Grid extends Component {
  public width: number;
  public height: number;
  public tileSize: number;
  public matrix: number[];

  constructor(public properties: GridInitProps) {
    super(properties);

    this.width = properties.width;
    this.height = properties.height;
    this.tileSize = properties.tileSize;
    this.matrix = properties.matrix;
  }

  public get config() {
    return { width: this.width, height: this.height, tileSize: this.tileSize };
  }

  public get size(): number {
    return this.width * this.height;
  }
}
