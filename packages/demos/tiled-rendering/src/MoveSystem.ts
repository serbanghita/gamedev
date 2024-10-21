import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import PhysicsBody from "./PhysicsBody";
import { randomInt } from "./helpers";
import IsCollisionTile from "./IsCollisionTile";
import IsMatrix from "./IsMatrix";
import { getTileFromCoordinates } from "@serbanghita-gamedev/matrix";

export default class MoveSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
  ) {
    super(world, query);
  }

  public update(now) {
    const map = this.world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity is not defined.`);
    }
    const matrixComponent = map.getComponent(IsMatrix);
    const matrix = matrixComponent.properties.matrix;

    this.query.execute().forEach((entity) => {
      const tile = entity.getComponent(IsCollisionTile);

      let futureX = tile.properties.x + randomInt(-1, 1);
      let futureY = tile.properties.y + randomInt(-1, 1);

      const currentTile = tile.properties.tile;
      const futureTile = getTileFromCoordinates(futureX, futureY, matrixComponent.properties);
      if (currentTile === futureTile || matrix[futureTile] === 0) {
        tile.properties.x = futureX;
        tile.properties.y = futureY;
        tile.properties.point.x = futureX;
        tile.properties.point.y = futureY;
        tile.properties.tile = futureTile;

        // Update the tile on the "matrix".
        matrix[currentTile] = 0;
        matrix[futureTile] = 2;
      }
    });
  }
}
