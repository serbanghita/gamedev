const directions: [number, number][] = [
  [-1, 0], // left
  [1, 0], // right
  [0, -1], // top
  [0, 1] // bottom
];

export default class AStarPathFinding {
  private readonly width!: number;
  private readonly height!: number;
  private targetTile!: number;
  private readonly flatMatrix: number[] = [];
  private visitedTiles: Set<number> = new Set();

  constructor(private matrix: number[], width: number, height: number) {
    this.width = width;
    this.height = height;
    this.flatMatrix = matrix;
  }

  public visit(tile: number) {
    console.log(tile);
    this.visitedTiles.add(tile);
    // this.flatMatrix[tile]
    return tile === this.targetTile;
  }

  private computeFutureTileFromDirection(tile: number, [directionX, directionY]: [number, number]) {
    let futureTile: number;

    if (directionX !== 0) {
      futureTile = tile + directionX;

      // Check out of bounds.
      if (
        (directionX === -1 && (futureTile + 1) % this.width === 0) ||
        (directionX === 1 && futureTile % this.width === 0)
      ) {
        return tile;
      }


    } else if (directionY !== 0) {
      futureTile = tile + (directionY * this.width);
    } else {
      return tile;
    }

    if (this.visitedTiles.has(futureTile)) {
      return tile;
    }

    if (futureTile < 0 || futureTile > this.flatMatrix.length - 1) {
      return tile;
    }

    if (this.flatMatrix[futureTile] === 1) {
      return tile;
    }

    return futureTile;
  }

  public search(startTile: number, targetTile: number) {
    this.targetTile = targetTile;

    const queue = [startTile];

    while(queue.length > 0) {
      const tile = queue.shift() as number;

      const found = this.visit(tile);
      if (found) {
        break;
      }

      directions.forEach((direction) => {
        const futureTile = this.computeFutureTileFromDirection(tile, direction);
        if (futureTile !== tile) {
          queue.push(futureTile);
        }
      });

    }

  }
}
