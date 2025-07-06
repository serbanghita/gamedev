import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { randomInt } from "../utils";
import { Direction, Directions, Position } from "@serbanghita-gamedev/component";
import { getTileFromPixelCoordinates, GridTile, Grid } from "@serbanghita-gamedev/grid";
import Walking from "../component/Walking";
import { StateStatus } from "../state";
import AutoMoving from "../component/AutoMoving";

export default class AutoMoveSystem extends System {

  private setPositionBasedOnDestination() {

  }

  public update(now: number) {
    const map = this.world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity is not defined.`);
    }
    const matrixComponent = map.getComponent(Grid);
    const matrix = matrixComponent.matrix;

    this.query.execute().forEach((entity) => {
      const tileComp = entity.getComponent(GridTile);
      const position = entity.getComponent(Position);
      const direction = entity.getComponent(Direction);
      const autoMoving = entity.getComponent(AutoMoving);

      let destinationX = autoMoving.destinationX;
      let destinationY = autoMoving.destinationY;

      /**
       * Stop if destination is reached.
       */
      if (
        autoMoving.hasNoDestination()
        ||
        entity.hasComponent(Walking) &&
        position.point.x === destinationX &&
        position.point.y === destinationY
      ) {
        if (entity.hasComponent(Walking)) {
          entity.removeComponent(Walking);
        }
        direction.setX(Directions.NONE);
        direction.setY(Directions.NONE);

        /**
         * Set new destination
         */
        destinationX = position.point.x + randomInt(-64, 64);
        destinationY = position.point.y + randomInt(-64, 64);
      }

      const currentTile = tileComp.tile;
      let destinationTile = 0;
      try {
        destinationTile = getTileFromPixelCoordinates(destinationX, destinationY, matrixComponent.config);
      } catch (e) {
        return;
      }

      // currentTile !== destinationTile &&
      if (destinationTile > 0 && matrix[destinationTile] !== 1) {
        console.log(destinationX, destinationY, destinationTile);

        // Compute the direction.
        if (destinationX < position.point.x) {
          direction.setX(Directions.LEFT);
        } else if (destinationX > position.point.x) {
          direction.setX(Directions.RIGHT);
        } else {
          direction.setX(Directions.NONE);
        }
        if (destinationY < position.point.y) {
          direction.setY(Directions.UP);
        } else if (destinationY > position.point.y) {
          direction.setY(Directions.DOWN);
        } else {
          direction.setY(Directions.NONE);
        }
        // Start the movement.
        if (!entity.hasComponent(Walking)) {
          entity.addComponent(Walking);
        }

        // Save new destination for later checks.
        autoMoving.setDestination(destinationX, destinationY);
      }
    });
  }
}
