import { System, World, Query } from "@serbanghita-gamedev/ecs";
import { Direction, Directions } from "@serbanghita-gamedev/component";
import { Walking } from "../component/Walking";

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
        component.properties.animationStateName = "walk_up";
      } else if (direction.y === Directions.DOWN) {
        component.properties.animationStateName = "walk_down";
      }

      if (direction.x === Directions.LEFT) {
        component.properties.animationStateName = "walk_left";
      } else if (direction.x === Directions.RIGHT) {
        component.properties.animationStateName = "walk_right";
      }

      // console.log(this.world.now, component.properties.lastFrameTime);

      if (this.world.now - component.properties.lastFrameTime >= 60) {
        // console.log('here wtf');
        component.properties.animationTick += 1;
        component.properties.lastFrameTime = this.world.now;
      }

      // console.log(component.properties);
    });
  }
}