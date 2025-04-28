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

export enum AStarPathFindingSearchStatus {
  INIT = 0x1,
  SEARCHING = 0x2,
  FOUND = 0x3,
  NOT_FOUND = 0x4
}

export type AStarPathFindingInit = {

  // 2d matrix.
  matrix2D?: number[][];

  // 1d flat matrix.
  matrix1D?: number[];
  matrixWidth?: number;
  matrixHeight?: number;

  matrixTileSize: number;

  startCoordinates: MatrixTileCoordinates;
  finishCoordinates: MatrixTileCoordinates;

  insertQueueCallbackFn?: (node: MinHeapNode) => any;
  foundCallbackFn?: (node: MinHeapNode) => any;
  searchType?: AStarPathFindingSearchType;
}

export type MatrixTileCoordinates = {
  x: number;
  y: number;
}

export default class AStarPathFinding {
  public queue!: MinHeapWithNodes;
  public visitedTiles: Set<number> = new Set();
  // Map<tile, cameFromTile>
  public cameFromTiles: Map<number, number> = new Map();

  private matrixWidth!: number;
  private matrixHeight!: number;
  private matrixTileSize!: number;
  private matrix2D: number[][] = [];
  private matrix1D: number[] = [];
  private matrixSize!: number;

  private searchType: AStarPathFindingSearchType = AStarPathFindingSearchType.CONTINUOUS;

  private startCoordinates!: MatrixTileCoordinates;
  public startTileValue!: number;
  private finishCoordinates!: MatrixTileCoordinates;
  public finishTileValue!: number;

  public status: AStarPathFindingSearchStatus = AStarPathFindingSearchStatus.INIT;

  private insertQueueCallbackFn: (node: MinHeapNode) => void = () => undefined;
  private foundCallbackFn: (node: MinHeapNode) => void = () => undefined;

  public constructor(config: AStarPathFindingInit) {
    this.init(config);
  }

  private checkMatrix1D(config: AStarPathFindingInit): void {
    if (config.matrix1D?.length === 0) {
      throw new Error(`Please set the matrix before attempting a search.`);
    }
    if (!config.matrixWidth || !config.matrixHeight) {
      throw new Error(`Matrix width/height for 1D matrix have not been defined.`);
    }
    if (config.matrixWidth * config.matrixHeight !== config.matrix1D?.length) {
      throw new Error(`Matrix width/height does not match the 1D matrix.`);
    }
    if (!config.matrixTileSize) {
      throw new Error(`Please set matrix tile size.`);
    }
  }

  private checkMatrix2D(config: AStarPathFindingInit): void {
    if (!Array.isArray(config.matrix2D) || config.matrix2D?.length === 0) {
      throw new Error(`Please set the matrix before attempting a search.`);
    }

    if (config.matrix2D[0]?.length === 0 || config.matrix2D.length === 1) {
      throw new Error(`Please set matrix rows.`);
    }

    if (!config.matrixTileSize) {
      throw new Error(`Please set matrix tile size.`);
    }
  }

  public init(config: AStarPathFindingInit): void {
    this.status = AStarPathFindingSearchStatus.INIT;

    if (config.matrix2D) {
      this.checkMatrix2D(config);
      this.matrix1D = config.matrix2D.reduce((acc, row) => [...acc, ...row], []);
      this.matrixWidth = config.matrix2D[0]?.length;
      this.matrixHeight = config.matrix2D.length;
    } else if (config.matrix1D) {
      this.checkMatrix1D(config);
      this.matrix1D = config.matrix1D;
      this.matrixWidth = config.matrixWidth as number;
      this.matrixHeight = config.matrixHeight as number;
    } else {
      throw new Error(`No matrix has been defined.`);
    }

    this.matrixTileSize = config.matrixTileSize;
    this.matrixSize = this.matrixWidth * this.matrixHeight;

    if (config.insertQueueCallbackFn) {
      this.insertQueueCallbackFn = config.insertQueueCallbackFn;
    }

    if (config.foundCallbackFn) {
      this.foundCallbackFn = config.foundCallbackFn;
    }

    if (config.searchType) {
      this.searchType = config.searchType;
    }

    if (
      config.startCoordinates.x < 0 ||
      config.startCoordinates.y < 0 ||
      config.startCoordinates.x > this.matrixWidth - 1 ||
      config.startCoordinates.y > this.matrixHeight - 1 ||
      config.finishCoordinates.x < 0 ||
      config.finishCoordinates.y < 0 ||
      config.finishCoordinates.x > this.matrixWidth - 1 ||
      config.finishCoordinates.y > this.matrixHeight - 1
    ) {
      throw new Error(`Out of bounds coordinates: start (${config.startCoordinates.x}, ${config.startCoordinates.y}) finish (${config.finishCoordinates.x}, ${config.finishCoordinates.y})`);
    }

    this.startCoordinates = config.startCoordinates;
    this.startTileValue = this.getTileValueFromCoordinates(config.startCoordinates.x, config.startCoordinates.y);
    this.finishCoordinates = config.finishCoordinates;
    this.finishTileValue = this.getTileValueFromCoordinates(config.finishCoordinates.x, config.finishCoordinates.y);

    // Push the first "Start" tile in order to start searching.
    this.queue = new MinHeapWithNodes([{value: this.startTileValue, cost: 0}]);
  }

  public setInsertQueueCallbackFn(fn: (node: MinHeapNode) => any) {
    this.insertQueueCallbackFn = fn;
  }

  public setFoundCallbackFn(fn: (node: MinHeapNode) => any) {
    this.foundCallbackFn = fn;
  }

  private visit(node: MinHeapNode): boolean {
    this.visitedTiles.add(node.value);

    return node.value === this.finishTileValue;
  }

  /**
   * Used for continuous (single/multi thread) search. (e.g. WebWorker).
   * @private
   */
  private searchByLoop(): boolean {
    let found = false;

    while(this.queue.size > 0) {
      found = this.doSearch();
    }

    return found;
  }

  /**
   * Used for sequential searching (e.g. 30 times / sec)
   * @private
   */
  private searchByStep(): boolean {

    if (this.queue.size > 0) {
      return this.doSearch();
    }

    if (this.queue.size === 0) {
      this.status = AStarPathFindingSearchStatus.NOT_FOUND;
    }

    return false;
  }

  private doSearch(): boolean {
      const node = this.queue.remove();
      const found = this.visit(node);

      if (found) {
        this.status = AStarPathFindingSearchStatus.FOUND;
        this.queue.clear();
        // console.log(this.cameFromTiles);
        this.foundCallbackFn(node);
        return true;
      }

      // For each direction, plan to visit respective tile.
      directions.forEach((direction) => {
        const futureNode = this.computeFutureTileValueAndCostFromDirection(node, direction);

        if (futureNode!== null && !this.queue.includes(futureNode.value) && futureNode.value !== node.value) {
          this.queue.insert(futureNode);
          this.cameFromTiles.set(futureNode.value, node.value);

          this.insertQueueCallbackFn(futureNode);
        }
      });

      return false;
    }

  public search(): boolean {

    this.status = AStarPathFindingSearchStatus.SEARCHING;

    if (this.searchType === AStarPathFindingSearchType.CONTINUOUS) {
      return this.searchByLoop();
    }

    //if (this.searchType === AStarPathFindingSearchType.BY_STEP) {
      return this.searchByStep();
    //}
  }

  public getTileValueFromCoordinates(x: number, y: number): number {
    const tileIndex = x + this.matrixWidth * y;

    if (tileIndex < 0 || tileIndex > this.matrixWidth * this.matrixHeight - 1) {
      throw new Error(`Invalid tile ${tileIndex} resulted from ${x} and ${y}`);
    }

    return tileIndex;
  }

  public getCoordinatesFromTileValue(tileValue: number): {x: number, y: number } {
    return {
      x: tileValue % this.matrixWidth,
      y: Math.floor(tileValue / this.matrixWidth),
    };
  }

  public computeEuclideanDistanceBetweenTwoTiles(start: number, finish: number): number {
    const startCoords = this.getCoordinatesFromTileValue(start);
    const finishCoords = this.getCoordinatesFromTileValue(finish);

    return Math.sqrt(Math.pow(startCoords.x - finishCoords.x, 2) + Math.pow(startCoords.y - finishCoords.y, 2));
  }

  private computeFutureTileValueAndCostFromDirection(node: MinHeapNode, [directionX, directionY]: [number, number]): MinHeapNode | null {
    let futureTileValue: number;
    let futureCost: number;

    if (directionX !== 0) {
      futureTileValue = node.value + directionX;
      // Calculate this based on heuristic?
      futureCost = this.computeEuclideanDistanceBetweenTwoTiles(futureTileValue, this.finishTileValue);
      console.log("futureCost", futureCost);

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
      futureCost = this.computeEuclideanDistanceBetweenTwoTiles(futureTileValue, this.finishTileValue);
      console.log("futureCost", futureCost);
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
    if (this.matrix1D[futureTileValue] > 0) {
      return null;
    }

    // new MinHeapNode
    return { value: futureTileValue, cost: futureCost };
  }
}
