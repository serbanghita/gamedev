import { System, Entity, World, Query } from "@serbanghita-gamedev/ecs";
import { Direction, Directions, Position } from "@serbanghita-gamedev/component";
import Walking from "../component/Walking";

export default class WalkingAnimationSystem extends System {

  public constructor(public world: World, public query: Query) {
    super(world, query);
  }

  public update() {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(Walking);
      const direction = entity.getComponent(Direction);
      /**
       * Animation
       */
      if (direction.y === Directions.UP) {
        component.animationStateName = "walk_up";
      } else if (direction.y === Directions.DOWN) {
        component.animationStateName = "walk_down";
      }

      if (direction.x === Directions.LEFT) {
        component.animationStateName = "walk_left";
      } else if (direction.x === Directions.RIGHT) {
        component.animationStateName = "walk_right";
      }

      if (this.world.now - component.lastFrameTime >= 60) {
        //console.log('here wtf');
        component.animationTick += 1;
        component.lastFrameTime = this.world.now;
      }
    });
  }
}