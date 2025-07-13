import { Direction, Directions, Position } from "@serbanghita-gamedev/component";
import { System, Entity, World, Query } from "@serbanghita-gamedev/ecs";
import Walking from "../component/Walking";
import { StateStatus } from "../state";
import { getTileFromPixelCoordinates, GridTile, Grid } from "@serbanghita-gamedev/grid";

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
    const tile = entity.getComponent(GridTile);
    const direction = entity.getComponent(Direction);
    const position = entity.getComponent(Position);
    const speed = 100;
    const movementAmount = speed * (deltaTime / 1000);

    let futureX = position.point.x;
    let futureY = position.point.y;

    if (direction.y === Directions.UP) {
      futureY -= movementAmount;
    } else if (direction.y === Directions.DOWN) {
      futureY += movementAmount;
    } else {
      direction.y = Directions.NONE;
    }

    if (direction.x === Directions.LEFT) {
      futureX -= movementAmount;
    } else if (direction.x === Directions.RIGHT) {
      futureX += movementAmount;
    } else {
      direction.x = Directions.NONE;
    }

    const currentTile = tile.tile;
    const futureTile = getTileFromPixelCoordinates(Math.round(futureX), Math.round(futureY), this.grid.config);

    //console.log(currentTile, futureTile);

    // Allow movement if tile is free.
    if (currentTile === futureTile || this.grid.matrix[futureTile] === 0) {
      position.point.y = futureY;
      position.point.x = futureX;

      if (currentTile !== futureTile) {
        this.grid.matrix[currentTile] = 0;
        this.grid.matrix[futureTile] = 0; // @todo Define tile types.
      }
    }
  }

  private onExit(entity: Entity, component: Walking) {
    component.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(Walking);

      if (component.status === StateStatus.FINISHED) {
        // console.log('FINISHED');
        entity.removeComponent(Walking);
        return;
      }

      if (component.status === StateStatus.NOT_STARTED) {
        //console.log('NOT_STARTED');
        this.onEnter(entity, component);
      }

      // console.log('onUpdate');
      this.onUpdate(entity);

      return true;
    });
  }
}
