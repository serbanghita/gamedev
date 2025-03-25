import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Tile, TileMatrix} from "@serbanghita-gamedev/component";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import TileToBeExplored from "../component/TileToBeExplored";
import RenderedInForeground from "../component/RenderedInForeground";

const directions: [number, number][] = [
  [-1, 0], // left
  [1, 0], // right
  [0, -1], // top
  [0, 1] // bottom
];

export default class PathFindingSystem extends System {
  private queue: number[] = [];
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
    this.queue.push(startTile);
    this.tileMatrix = this.map.getComponent(TileMatrix);
  }

  public visit(tile: number): boolean {
    this.visitedTiles.add(tile);

    return tile === this.finishTile;
  }

  private computeFutureTileFromDirection(tile: number, [directionX, directionY]: [number, number]): number {
    let futureTile: number;

    if (directionX !== 0) {
      futureTile = tile + directionX;

      // Check out of bounds.
      if (
        (directionX === -1 && (futureTile + 1) % this.tileMatrix.width === 0) ||
        (directionX === 1 && futureTile % this.tileMatrix.width === 0)
      ) {
        return tile;
      }

    } else if (directionY !== 0) {
      futureTile = tile + (directionY * this.tileMatrix.width);
    } else {
      return tile;
    }

    if (this.visitedTiles.has(futureTile)) {
      return tile;
    }

    if (futureTile < 0 || futureTile > this.tileMatrix.size - 1) {
      return tile;
    }

    // Check if it's blocked. This can be custom fn.
    if (this.tileMatrix.matrix[futureTile] > 0) {
      return tile;
    }

    return futureTile;
  }


  public update(now: number): void {
    if (this.queue.length > 0) {
      const tile = this.queue.shift();
      if (typeof tile === 'undefined') {
        return;
      }
      const found = this.visit(tile);
      if (found) {
        this.queue = [];
        return;
      }

      // For each direction, plan to visit respective tile.
      directions.forEach((direction) => {
        const futureTile = this.computeFutureTileFromDirection(tile, direction);

        if (!this.queue.includes(futureTile) && futureTile !== tile) {
          this.queue.push(futureTile);

          const tileEntity = this.world.getEntity(`tile-${futureTile}`);
          if (tileEntity) {
            tileEntity.addComponent(TileToBeExplored);
            tileEntity.addComponent(RenderedInForeground);
          }
        }
      });
    }
  }
}
