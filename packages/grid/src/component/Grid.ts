import { Component } from "@serbanghita-gamedev/ecs";

export interface GridProps {
  // Flat array matrix with all the possible entities, obstacles, etc.
  matrix: number[];
  // Width in tiles.
  width: number;
  // Height in tiles.
  height: number;
  // Size of the tile in pixels.
  tileSize: number;
}

export default class Grid extends Component<GridProps> {
  constructor(public properties: GridProps) {
    super(properties);
  }

  public get width(): number {
    return this.properties.width;
  }

  public get height(): number {
    return this.properties.height;
  }

  public get tileSize(): number {
    return this.properties.tileSize;
  }

  public get matrix(): number[] {
    return this.properties.matrix;
  }

  public get config() {
    return { width: this.width, height: this.height, tileSize: this.tileSize };
  }

  public get size(): number {
    return this.width * this.height;
  }
}
