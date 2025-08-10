import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { randomInt } from "../utils";
import { Direction, Directions, PositionOnScreen } from "@serbanghita-gamedev/component";
import { getTileFromPixelCoordinates, getPixelCoordinatesFromTile, getTileFromGridCoordinates, GridTile, Grid, PositionOnGrid, getGridCoordinatesFromTile } from "@serbanghita-gamedev/grid";
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

  // private setPositionBasedOnDestination() {
  //
  // }
  //
  // private pickNewDestinationOnGrid() {
  //   /**
  //    * Set new destination
  //    */
  //   const player = this.world.getEntity('player') as Entity;
  //   const playerPositionOnGrid = player.getComponent(PositionOnGrid);
  //   // const playerTile = player.getComponent(GridTile);
  //   // destinationX = position.point.x + randomInt(-64, 64);
  //   // destinationY = position.point.y + randomInt(-64, 64);
  //
  //   return { x: playerPositionOnGrid.x, y: playerPositionOnGrid.y };
  // }

  public update(now: number) {
    this.query.execute().forEach((entity) => {
      // console.log(entity.id);
      const tileComp = entity.getComponent(GridTile);
      const positionOnScreen = entity.getComponent(PositionOnScreen);
      const positionOnGrid = entity.getComponent(PositionOnGrid);
      const direction = entity.getComponent(Direction);
      const autoMoving = entity.getComponent(AutoMoving);

      if (!autoMoving.hasDestination()) {
        // const {x, y} = this.pickNewDestinationOnGrid();
        // autoMoving.setDestination(x, y);
        entity.removeComponent(AutoMoving);
        return;
      }

      let gridDestinationX = autoMoving.destinationX;
      let gridDestinationY = autoMoving.destinationY;
      // let destinationTile = getTileFromPixelCoordinates(destinationX, destinationY, this.grid.config);
      let destinationTile = getTileFromGridCoordinates(gridDestinationX, gridDestinationY, this.grid.config);
      // let { x: destinationX, y: destinationY } = getPixelCoordinatesFromTile(destinationTile, this.grid.config);
      let { x: destinationX, y: destinationY } = getGridCoordinatesFromTile(destinationTile, this.grid.config);
      // console.log('destination', destinationX, destinationY);
      // console.log('positionOnScreen', positionOnScreen.x, positionOnScreen.y);

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
