import { Direction, Directions, PositionOnScreen } from "@serbanghita-gamedev/component";
import { System, Entity, World, Query } from "@serbanghita-gamedev/ecs";
import { Walking } from "../component/Walking";
import { StateStatus } from "../state";
import { getTileFromPixelCoordinates, GridTile, Grid, PositionOnGrid, getGridCoordinatesFromTile } from "@serbanghita-gamedev/grid";
import {Idle} from "../component/Idle";

export default class WalkingSystem extends System {
  private grid!: Grid;

  public constructor(public world: World, public query: Query) {
    super(world, query);

    const map = this.world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity is not defined.`);
    }
    this.grid = map.getComponent(Grid);
  }

  private onEnter(entity: Entity, component: Walking) {
    component.init();
  }

  private onUpdate(entity: Entity) {
    const deltaTime = this.world.frameDuration;

    /**
     * Position (based on Direction)
     * Checks if next tile is occupied.
     */
    const gridTile = entity.getComponent(GridTile);
    const direction = entity.getComponent(Direction);
    const positionOnGrid = entity.getComponent(PositionOnGrid);
    const positionOnScreen = entity.getComponent(PositionOnScreen);
    const speed = 100;
    // Round to two decimals (e.g. 10.45)
    let movementAmount = speed * (deltaTime / 1000);

    let futureX = positionOnScreen.x;
    let futureY = positionOnScreen.y;

    if (direction.y === Directions.UP) {
      futureY -= movementAmount;
    } else if (direction.y === Directions.DOWN) {
      futureY += movementAmount;
    } else {
      //direction.setY(Directions.NONE);
    }

    if (direction.x === Directions.LEFT) {
      futureX -= movementAmount;
    } else if (direction.x === Directions.RIGHT) {
      futureX += movementAmount;
    } else {
      //direction.setX(Directions.NONE);
    }

    // futureX = roundWithTwoDecimals(futureX);
    // futureY = roundWithTwoDecimals(futureY);

    const currentTile = gridTile.tile;
    let futureTile = currentTile;
    try {
      // Try/catch is for frames being skipped (maybe slow computer).
      futureTile = getTileFromPixelCoordinates(Math.round(futureX), Math.round(futureY), this.grid.config);
    } catch (e) {
      console.warn(e);
      return;
    }

    // @todo: Need to check for max travel distance. So I can avoid Entity skipping across screen.

    // Allow movement if tile is free.
    if (currentTile === futureTile || this.grid.matrix[futureTile] === 0) {
      positionOnScreen.setXY(futureX, futureY);
      const { x: gridX, y: gridY } = getGridCoordinatesFromTile(futureTile, this.grid.config);
      positionOnGrid.setXY(gridX, gridY);

      if (currentTile !== futureTile) {
        gridTile.setTile(futureTile);
        this.grid.matrix[currentTile] = 0;
        this.grid.matrix[futureTile] = 0; // @todo Define tile types.
      }
    }
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {

      this.onUpdate(entity);

      return true;
    });
  }
}
