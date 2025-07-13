import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { randomInt } from "../utils";
import { Direction, Directions, Position } from "@serbanghita-gamedev/component";
import { getTileFromPixelCoordinates, GridTile, Grid } from "@serbanghita-gamedev/grid";
import Walking from "../component/Walking";
import { StateStatus } from "../state";
import AutoMoving from "../component/AutoMoving";

export default class AutoMoveSystem extends System {
  private grid!: Grid;

  public constructor(public world: World, public query: Query) {
    super(world, query);

    const map = this.world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity is not defined.`);
    }
    this.grid = map.getComponent(Grid);
  }

  private setPositionBasedOnDestination() {

  }

  public update(now: number) {
    this.query.execute().forEach((entity) => {
      const tileComp = entity.getComponent(GridTile);
      const position = entity.getComponent(Position);
      const direction = entity.getComponent(Direction);
      const autoMoving = entity.getComponent(AutoMoving);

      let destinationX = autoMoving.destinationX;
      let destinationY = autoMoving.destinationY;
      let destinationTile = getTileFromPixelCoordinates(destinationX, destinationY, this.grid.config);

      /**
       * Stop if destination is reached.
       */
      if (tileComp.tile === destinationTile) {
        console.log('Destination tile reached');
        if (entity.hasComponent(Walking)) {
          entity.removeComponent(Walking);
        }
        direction.setX(Directions.NONE);
        direction.setY(Directions.NONE);
        return;
      }


      if (autoMoving.hasNoDestination()) {
        /**
         * Set new destination
         */
        const player = this.world.getEntity('player') as Entity;
        const playerPosition = player.getComponent(Position);
        const playerTile = player.getComponent(GridTile);

        // Already there.
        if (tileComp.tile === playerTile.tile) {
          console.log('Already at destination tile');
          return;
        }

        destinationX = playerPosition.point.x
        destinationY = playerPosition.point.y;

        // destinationX = position.point.x + randomInt(-64, 64);
        // destinationY = position.point.y + randomInt(-64, 64);
      }

      // currentTile !== destinationTile &&
      if (destinationTile > 0 && this.grid.matrix[destinationTile] !== 1) {
        console.log(destinationX, destinationY, destinationTile, this.grid.matrix[destinationTile]);

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
