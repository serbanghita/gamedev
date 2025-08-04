import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { randomInt } from "../utils";
import { Direction, Directions, PositionOnScreen } from "@serbanghita-gamedev/component";
import { getTileFromPixelCoordinates, getPixelCoordinatesFromTile, getTileFromGridCoordinates, GridTile, Grid, PositionOnGrid } from "@serbanghita-gamedev/grid";
import { Walking } from "../component/Walking";
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

  private pickNewDestinationOnGrid() {
    /**
     * Set new destination
     */
    const player = this.world.getEntity('player') as Entity;
    const playerPositionOnGrid = player.getComponent(PositionOnGrid);
    // const playerTile = player.getComponent(GridTile);
    // destinationX = position.point.x + randomInt(-64, 64);
    // destinationY = position.point.y + randomInt(-64, 64);

    return { x: playerPositionOnGrid.x, y: playerPositionOnGrid.y };
  }

  public update(now: number) {
    this.query.execute().forEach((entity) => {
      // console.log(entity.id);
      const tileComp = entity.getComponent(GridTile);
      const position = entity.getComponent(PositionOnScreen);
      const direction = entity.getComponent(Direction);
      const autoMoving = entity.getComponent(AutoMoving);

      if (!autoMoving.hasDestination()) {
        const {x, y} = this.pickNewDestinationOnGrid();
        autoMoving.setDestination(x, y);
        return;
      }

      let gridDestinationX = autoMoving.destinationX;
      let gridDestinationY = autoMoving.destinationY;
      // let destinationTile = getTileFromPixelCoordinates(destinationX, destinationY, this.grid.config);
      let destinationTile = getTileFromGridCoordinates(gridDestinationX, gridDestinationY, this.grid.config);
      let { x: destinationX, y: destinationY } = getPixelCoordinatesFromTile(destinationTile, this.grid.config);

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
        autoMoving.clearDestination();
        return;
      }

      if (destinationTile > 0 && this.grid.matrix[destinationTile] !== 1) {
        // Compute the direction.
        if (destinationX < Math.round(position.x)) {
          direction.setX(Directions.LEFT);
          console.log("2", destinationX, Math.round(position.x));
        } else if (destinationX > Math.round(position.x)) {
          direction.setX(Directions.RIGHT);
          console.log("3", destinationX, Math.round(position.x));
        } else {
          direction.setX(Directions.NONE);
        }
        if (destinationY < Math.round(position.y)) {
          direction.setY(Directions.UP);
          console.log("4");
        } else if (destinationY > Math.round(position.y)) {
          direction.setY(Directions.DOWN);
          console.log("5");
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
