import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { randomInt } from "../utils";
import {Tile, TileMatrix} from "@serbanghita-gamedev/component";
import { getTileFromCoordinates } from "@serbanghita-gamedev/matrix";

export default class MoveSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
  ) {
    super(world, query);
  }

  public update(now: number) {
    const map = this.world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity is not defined.`);
    }
    const matrixComponent = map.getComponent(TileMatrix);
    const matrix = matrixComponent.matrix;

    this.query.execute().forEach((entity) => {
      const tile = entity.getComponent(Tile);

      let futureX = tile.x + randomInt(-1, 1);
      let futureY = tile.y + randomInt(-1, 1);

      const currentTile = tile.tile;
      const futureTile = getTileFromCoordinates(futureX, futureY, matrixComponent.matrixConfig);
      if (currentTile === futureTile || matrix[futureTile] === 0) {
        tile.point.x = futureX;
        tile.point.y = futureY;
        // tile.tile = futureTile;

        // Update the tile on the "matrix".
        matrix[currentTile] = 0;
        matrix[futureTile] = 2;
      }
    });
  }
}
