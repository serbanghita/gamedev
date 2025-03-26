import MinHeapWithNodes, {MinHeapNode} from "./MinHeapWithNodes";

const directions: [number, number][] = [
  [-1, 0], // left
  [1, 0], // right
  [0, -1], // top
  [0, 1] // bottom
];

export enum AStarPathFindingSearchType {
  CONTINUOUS = 0x1,
  BY_STEP = 0x2
}

export type AStarPathFindingInit = {
  matrix: number[][];
  matrixTileSize: number;

  startCoordinates: MatrixTileCoordinates;
  finishCoordinates: MatrixTileCoordinates;

  insertQueueCallbackFn?: (node: MinHeapNode) => any;
  searchType?: AStarPathFindingSearchType;

}

export type MatrixTileCoordinates = {
  x: number;
  y: number;
}

export default class AStarPathFinding {
  public queue!: MinHeapWithNodes;
  private visitedTiles: Set<number> = new Set();

  private matrixWidth!: number;
  private matrixHeight!: number;
  private matrixTileSize!: number;
  private matrix: number[][] = [];
  private matrixFlat: number[] = [];
  private matrixSize!: number;

  private searchType: AStarPathFindingSearchType = AStarPathFindingSearchType.CONTINUOUS;

  private startCoordinates!: MatrixTileCoordinates;
  private startTileValue!: number;
  private finishCoordinates!: MatrixTileCoordinates;
  private finishTileValue!: number;

  private insertQueueCallbackFn: (node: MinHeapNode) => void = () => undefined;

  public constructor(config: AStarPathFindingInit) {
    this.init(config);
  }

  public init(config: AStarPathFindingInit): void {
    this.matrix = config.matrix;
    this.matrixFlat = config.matrix.reduce((acc, row) => [...acc, ...row], []);

    this.matrixWidth = config.matrix[0].length;
    this.matrixHeight = config.matrix.length;
    this.matrixTileSize = config.matrixTileSize;
    this.matrixSize = this.matrixWidth * this.matrixHeight;

    if (config.insertQueueCallbackFn) {
      this.insertQueueCallbackFn = config.insertQueueCallbackFn;
    }
    if (config.searchType) {
      this.searchType = config.searchType;
    }

    this.startCoordinates = config.startCoordinates;
    this.startTileValue = this.getTileValueFromCoordinates(config.startCoordinates.x, config.startCoordinates.y);
    this.finishCoordinates = config.finishCoordinates;
    this.finishTileValue = this.getTileValueFromCoordinates(config.finishCoordinates.x, config.finishCoordinates.y);

    if (this.startCoordinates.x < 0 || this.startCoordinates.y < 0 || this.finishCoordinates.x < 0 || this.finishCoordinates.y < 0) {
      throw new Error(`Invalid start coordinates ${this.startCoordinates.x} x ${this.startCoordinates.y} or finish coordinates ${this.finishCoordinates.x} x ${this.finishCoordinates.y}`);
    }

    if (!this.matrixWidth || !this.matrixHeight || !this.matrixTileSize) {
      throw new Error(`Please set matrix data (width, height, tileSize)`);
    }

    if (this.matrix.length === 0 || this.matrixFlat.length === 0) {
      throw new Error(`Please set the matrix before attempting a search.`);
    }

    // Push the first "Start" tile in order to start searching.
    this.queue = new MinHeapWithNodes([{value: this.startTileValue, cost: 0}]);
  }

  public setQueueCallbackFn(fn: (node: MinHeapNode) => any) {
    this.insertQueueCallbackFn = fn;
  }

  private visit(node: MinHeapNode): boolean {
    this.visitedTiles.add(node.value);

    return node.value === this.finishTileValue;
  }

  /**
   * Used for continuous (single/multi thread) search. (e.g. WebWorker).
   * @private
   */
  private searchByLoop() {
    while(this.queue.size > 0) {
      this.doSearch();
    }
  }

  /**
   * Used for sequential searching (e.g. 30 times / sec)
   * @private
   */
  private searchByStep() {
    if (this.queue.size > 0) {
      this.doSearch();
    }
  }

  private doSearch() {
      const node = this.queue.remove();
      const found = this.visit(node);

      if (found) {
        this.queue.clear();
        return;
      }

      // For each direction, plan to visit respective tile.
      directions.forEach((direction) => {
        const futureNode = this.computeFutureTileValueAndCostFromDirection(node, direction);

        if (futureNode!== null && !this.queue.includes(futureNode.value) && futureNode.value !== node.value) {
          this.queue.insert(futureNode);

          this.insertQueueCallbackFn(futureNode);
        }
      });
    }

  public search() {
    if (this.searchType === AStarPathFindingSearchType.CONTINUOUS) {
      return this.searchByLoop();
    }

    if (this.searchType === AStarPathFindingSearchType.BY_STEP) {
      return this.searchByStep();
    }
  }

  private getTileValueFromCoordinates(x: number, y: number): number {
    const tileIndex = Math.floor(x / this.matrixTileSize) + this.matrixWidth * Math.floor(y / this.matrixTileSize);

    if (tileIndex < 0 || tileIndex > this.matrixWidth * this.matrixHeight - 1) {
      throw new Error(`Invalid tile ${tileIndex} resulted from ${x} and ${y}`);
    }

    return tileIndex;
  }

  private getCoordinatesFromTileValue(tileValue: number): {x: number, y: number } {
    return {
      x: this.matrixTileSize * (tileValue % this.matrixWidth),
      y: Math.floor(tileValue / this.matrixWidth) * this.matrixTileSize,
    };
  }

  private computeEuclidianDistanceBetweenTwoTiles(start: number, finish: number): number {
    const startCoords = this.getCoordinatesFromTileValue(start);
    const finishCoords = this.getCoordinatesFromTileValue(finish);

    return Math.sqrt(Math.pow(startCoords.x - startCoords.x, 2) + Math.pow(finishCoords.y - finishCoords.y, 2));
  }

  private computeFutureTileValueAndCostFromDirection(node: MinHeapNode, [directionX, directionY]: [number, number]): MinHeapNode | null {
    let futureTileValue: number;
    let futureCost: number;

    if (directionX !== 0) {
      futureTileValue = node.value + directionX;
      // Calculate this based on heuristic?
      futureCost = this.computeEuclidianDistanceBetweenTwoTiles(futureTileValue, this.finishTileValue);

      // Check out of bounds.
      if (
        (directionX === -1 && (futureTileValue + 1) % this.matrixWidth === 0) ||
        (directionX === 1 && futureTileValue % this.matrixWidth === 0)
      ) {
        return null;
      }

    } else if (directionY !== 0) {
      futureTileValue = node.value + (directionY * this.matrixWidth);
      // Calculate this based on heuristic?
      futureCost = this.computeEuclidianDistanceBetweenTwoTiles(futureTileValue, this.finishTileValue);
    } else {
      return null;
    }

    // Already visited?
    if (this.visitedTiles.has(futureTileValue)) {
      return null;
    }

    // Out of matrix bounds.
    if (futureTileValue < 0 || futureTileValue > this.matrixSize - 1) {
      return null;
    }

    // Check if it's blocked. This can be custom fn.
    if (this.matrixFlat[futureTileValue] > 0) {
      return null;
    }

    // new MinHeapNode
    return { value: futureTileValue, cost: futureCost };
  }
}
