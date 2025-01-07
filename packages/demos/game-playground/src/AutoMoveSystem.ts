import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { randomInt } from "./utils";
import {IsOnATile, IsAMatrix, Direction, Directions} from "@serbanghita-gamedev/component";
import { getTileFromCoordinates } from "@serbanghita-gamedev/matrix";
import IsWalking from "./IsWalking";
import { StateStatus } from "./state";

export default class AutoMoveSystem extends System {
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
    const matrixComponent = map.getComponent(IsAMatrix);
    const matrix = matrixComponent.properties.matrix;

    this.query.execute().forEach((entity) => {
      const tile = entity.getComponent(IsOnATile);
      const direction = entity.getComponent(Direction);

      let destinationX = tile.properties.x + randomInt(-6, 6);
      let destinationY = tile.properties.y + randomInt(-6, 6);

      const currentTile = tile.properties.tile;
      const destinationTile = getTileFromCoordinates(destinationX, destinationY, matrixComponent.properties);

      if (matrix[destinationTile] === 0) {
        // Compute the direction.
        if (destinationX < tile.properties.point.x) {
          direction.properties.literal = 'left';
          direction.properties.x = Directions.LEFT;
        } else if (destinationX > tile.properties.point.x) {
          direction.properties.literal = 'right'
          direction.properties.x = Directions.RIGHT;
        }
        if (destinationY < tile.properties.point.y) {
          direction.properties.literal = 'up';
          direction.properties.y = Directions.UP;
        } else if (destinationY > tile.properties.point.y) {
          direction.properties.literal = 'down';
          direction.properties.y = Directions.DOWN;
        }
        // Start the movement.
        entity.addComponent(IsWalking, {
          tick: 0,
          animationTick: 0,
          status: StateStatus.STARTED,
        });

      }

    });
  }
}
