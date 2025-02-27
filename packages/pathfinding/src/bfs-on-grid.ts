// const grid1 = [
//   [{ name: 'A', tile: 0 }, {name: 'B', tile: 1}, {name: 'C', tile: 0}, {name: 'D', tile: 0}, {name: 'E', tile: 0}],
//   [{name: 'F', tile: 0 }, { name: 'G', tile: 1}, {name: 'H', tile: 0}, {name: 'I', tile: 0}, {name: 'J', tile: 0}],
//   [{name: 'K', tile: 0}, {name: 'L', tile: 0}, { name: 'M', tile: 0}, {name: 'N', tile: 1}, {name: 'O', tile: 0}],
// ];

// const grid2 = [
//   [0,1,0,0,0],
//   [0,1,0,1,0],
//   [0,0,0,0,0],
//   [0,1,0,1,9]
// ];



import * as process from "node:process";

const matrix2 = [
  [0,1,0,0,0],
  [0,1,0,1,0],
  [0,0,0,0,0],
  [0,1,0,1,9]
];

// const matrix2 = [
//   [0, 1, 2, 3, 4],
//   [5, 6, 7, 8, 9],
//   [10,11,12,13,14],
//   [15,16,17,18,19]
// ];



const directions: [number, number][] = [
  [-1, 0], // left
  [1, 0], // right
  [0, -1], // top
  [0, 1] // bottom
];

class Bfs {
  private readonly width!: number;
  private height!: number;
  private targetTile!: number;
  private readonly flatMatrix: number[] = [];
  private visitedTiles: Set<number> = new Set();

  constructor(private matrix: number[][]) {
    this.width = matrix[0].length;
    this.height = matrix.length;
    this.flatMatrix = matrix.reduce((acc, row) => acc.concat(row), []);
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


const a = new Bfs(matrix2);
a.search(0, 19);
