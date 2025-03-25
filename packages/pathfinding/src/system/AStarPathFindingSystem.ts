import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Tile, TileMatrix} from "@serbanghita-gamedev/component";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import TileToBeExplored from "../component/TileToBeExplored";
import RenderedInForeground from "../component/RenderedInForeground";
import MinHeapWithNodes, {MinHeapNode} from "../MinHeapWithNodes";

const directions: [number, number][] = [
  [-1, 0], // left
  [1, 0], // right
  [0, -1], // top
  [0, 1] // bottom
];

export default class AStarPathFindingSystem extends System {
  private queue!: MinHeapWithNodes;
  private visitedTiles: Set<number> = new Set();
  private tileMatrix: TileMatrix;

  public constructor(
    public world: World,
    public query: Query,
    public map: Entity,
    public startTile: number,
    public finishTile: number
  ) {
    super(world, query);

    // Push the first "Start" tile in order to start searching.
    this.queue = new MinHeapWithNodes([{value: startTile, cost: 0}]);

    this.tileMatrix = this.map.getComponent(TileMatrix);
  }

  public visit(node: MinHeapNode): boolean {
    this.visitedTiles.add(node.value);

    return node.value === this.finishTile;
  }

  private computeEuclidianDistanceBetweenTwoTiles(tileStart: number, tileEnd: number): number {
    const tileStartEntity = this.world.getEntity(`tile-${tileStart}`);
    const tileEndEntity = this.world.getEntity(`tile-${tileEnd}`);
    
    const tileStartComp = tileStartEntity?.getComponent(Tile);
    const tileEndComp = tileEndEntity?.getComponent(Tile);

    if (!tileStartComp || !tileEndComp) {
      return 0;
    }

    return Math.sqrt(Math.pow(tileStartComp.x - tileEndComp.x, 2) + Math.pow(tileStartComp.y - tileEndComp.y, 2)); 
  }

  private computeFutureTileAndCostFromDirection(node: MinHeapNode, [directionX, directionY]: [number, number]): MinHeapNode | null {
    let futureTile: number;
    let futureCost: number;

    if (directionX !== 0) {
      futureTile = node.value + directionX;
      // Calculate this based on heuristic?
      futureCost = this.computeEuclidianDistanceBetweenTwoTiles(futureTile, this.finishTile);

      // Check out of bounds.
      if (
        (directionX === -1 && (futureTile + 1) % this.tileMatrix.width === 0) ||
        (directionX === 1 && futureTile % this.tileMatrix.width === 0)
      ) {
        return null;
      }

    } else if (directionY !== 0) {
      futureTile = node.value + (directionY * this.tileMatrix.width);
      // Calculate this based on heuristic?
      futureCost = this.computeEuclidianDistanceBetweenTwoTiles(futureTile, this.finishTile);
    } else {
      return null;
    }

    // Already visited?
    if (this.visitedTiles.has(futureTile)) {
      return null;
    }

    // Out of matrix bounds.
    if (futureTile < 0 || futureTile > this.tileMatrix.size - 1) {
      return null;
    }

    // Check if it's blocked. This can be custom fn.
    if (this.tileMatrix.matrix[futureTile] > 0) {
      return null;
    }

    return { value: futureTile, cost: futureCost };
  }


  public update(now: number): void {
    if (this.queue.size > 0) {
      const node = this.queue.remove();
      const found = this.visit(node);

      if (found) {
        this.queue.clear();
        return;
      }

      // For each direction, plan to visit respective tile.
      directions.forEach((direction) => {
        const futureNode = this.computeFutureTileAndCostFromDirection(node, direction);

        if (futureNode!== null && !this.queue.includes(futureNode.value) && futureNode.value !== node.value) {
          this.queue.insert(futureNode);

          const tileEntity = this.world.getEntity(`tile-${futureNode.value}`);
          if (tileEntity) {
            tileEntity.addComponent(TileToBeExplored);
            tileEntity.addComponent(RenderedInForeground);
          }
        }
      });
    }
  }
}
