import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { Direction, Directions, PositionOnScreen } from "@serbanghita-gamedev/component";
import { getTileFromGridCoordinates, GridTile, Grid, PositionOnGrid, getGridCoordinatesFromTile } from "@serbanghita-gamedev/grid";
import { Walking } from "../component/Walking";
import WalkingToDestination from "../component/WalkingToDestination";

export default class WalkingToDestinationSystem extends System {
  private grid!: Grid;

  public constructor(public world: World, public query: Query) {
    super(world, query);

    const map = this.world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity is not defined.`);
    }
    this.grid = map.getComponent(Grid);
  }

  public update(now: number) {
    this.query.execute().forEach((entity) => {
      // console.log(entity.id);
      const tileComp = entity.getComponent(GridTile);
      const positionOnGrid = entity.getComponent(PositionOnGrid);
      const direction = entity.getComponent(Direction);
      const autoMoving = entity.getComponent(WalkingToDestination);

      if (!autoMoving.hasDestination()) {
        entity.removeComponent(WalkingToDestination);
        return;
      }

      const gridDestinationX = autoMoving.destinationX;
      const gridDestinationY = autoMoving.destinationY;
      const destinationTile = getTileFromGridCoordinates(gridDestinationX, gridDestinationY, this.grid.config);
      const { x: destinationX, y: destinationY } = getGridCoordinatesFromTile(destinationTile, this.grid.config);

      /**
       * Stop if destination is reached.
       */
      if (tileComp.tile === destinationTile) {
        // console.log('Destination tile reached');
        if (entity.hasComponent(Walking)) {
          entity.removeComponent(Walking);
        }
        // direction.setX(Directions.NONE);
        // direction.setY(Directions.NONE);
        autoMoving.clearDestination();
        return;
      }

      /**
       * Walking continues. Compute direction.
       */
      if (destinationTile > 0 && this.grid.matrix[destinationTile] !== 1) {
        // Compute the X direction.
        if (destinationX < positionOnGrid.x) {
          direction.setX(Directions.LEFT);
        } else if (destinationX > positionOnGrid.x) {
          direction.setX(Directions.RIGHT);
        } else {
          direction.setX(Directions.NONE);
        }

        // Compute the X direction.
        if (destinationY < positionOnGrid.y) {
          direction.setY(Directions.UP);
        } else if (destinationY > positionOnGrid.y) {
          direction.setY(Directions.DOWN);
        } else {
          direction.setY(Directions.NONE);
        }

        // Start the movement.
        if (!entity.hasComponent(Walking)) {
          entity.addComponent(Walking, Walking.defaultProps);
        }
      }
    });
  }
}
