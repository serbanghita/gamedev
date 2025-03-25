import { Component } from "@serbanghita-gamedev/ecs";

export interface TileMatrixInitProps {
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
  public width: number;
  public height: number;
  public tileSize: number;
  public matrix: number[];

  constructor(public properties: TileMatrixInitProps) {
    super(properties);

    this.width = properties.width;
    this.height = properties.height;
    this.tileSize = properties.tileSize;
    this.matrix = properties.matrix;
  }

  public get matrixConfig() {
    return { width: this.width, height: this.height, tileSize: this.tileSize };
  }

  public get size(): number {
    return this.width * this.height;
  }
}
