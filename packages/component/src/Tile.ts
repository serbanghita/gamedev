import { Component } from "@serbanghita-gamedev/ecs";
import { Point } from "@serbanghita-gamedev/geometry";
import { getTileFromCoordinates, MatrixConfig } from "@serbanghita-gamedev/matrix";

export interface TileInitProps {
  point: Point;
  matrixConfig: MatrixConfig;
}

export default class Tile extends Component {
  private point!: Point;
  private matrixConfig!: MatrixConfig;

  constructor(public properties: TileInitProps) {
    super(properties);
    this.init(properties);
  }

  public init(properties: TileInitProps) {
    this.point = properties.point;
    this.matrixConfig = properties.matrixConfig;
  }

  public get tile(): number {
    return getTileFromCoordinates(this.point.x, this.point.y, this.matrixConfig);
  }
}
