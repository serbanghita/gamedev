import { GridTileType } from "./component/GridTile";

export type GridProps = {
  width: number;
  height: number;
  tileSize: number;
};

export function create1DMatrix(gridProps: GridProps) {
  return new Array(gridProps.width * gridProps.height).fill(GridTileType.FREE);
}

export function create2DMatrix(gridProps: GridProps): Array<GridTileType[]> {
  const grid: Array<Array<number>> = [];

  for (let row = 1; row <= gridProps.height; row++) {
    grid[row - 1] = [];
    for (let col = 1; col <= gridProps.width; col++) {
      grid[row - 1][col - 1] = GridTileType.FREE;
    }
  }

  return grid;
}

export function getPixelCoordinatesFromTile(tile: number, gridProps: GridProps) {
  return {
    x: gridProps.tileSize * (tile % gridProps.width),
    y: Math.floor(tile / gridProps.width) * gridProps.tileSize,
  };
}

export function getGridCoordinatesFromTile(tile: number, gridProps: GridProps) {
  return {
    x: tile % gridProps.width,
    y: Math.floor(tile / gridProps.width),
  };
}

export function getTileFromGridCoordinates<T extends GridProps>(x: number, y: number, gridProps: T): number {
  const tileIndex = x + gridProps.width * y;
  return tileIndex;
}

export function getTileFromPixelCoordinates<T extends GridProps>(x: number, y: number, gridProps: T): number {
  const tileIndex = Math.floor(x / gridProps.tileSize) + gridProps.width * Math.floor(y / gridProps.tileSize);

  if (tileIndex < 0 || tileIndex > gridProps.width * gridProps.height - 1) {
    throw new Error(`Invalid tile ${tileIndex} resulted from ${x} and ${y}`);
  }

  return tileIndex;
}
