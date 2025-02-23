import { Direction, Directions } from "@serbanghita-gamedev/component";
import { System, Entity } from "@serbanghita-gamedev/ecs";
import Walking from "../component/Walking";
import { StateStatus } from "../state";

export default class WalkingSystem extends System {
  private lastFrameTime: DOMHighResTimeStamp = 0;

  private onEnter(entity: Entity, component: Walking) {
    component.init();
  }

  private onUpdate(entity: Entity, component: Walking) {
    const direction = entity.getComponent(Direction);

    if (direction.properties.y === Directions.UP) {
      component.animationStateName = "walk_up";
    } else if (direction.properties.y === Directions.DOWN) {
      component.animationStateName = "walk_down";
    }

    if (direction.properties.x === Directions.LEFT) {
      component.animationStateName = "walk_left";
    } else if (direction.properties.x === Directions.RIGHT) {
      component.animationStateName = "walk_right";
    }


    if (this.world.now - this.lastFrameTime >= 60) {
      component.animationTick += 1;
      this.lastFrameTime = this.world.now;
    }

  }

  private onExit(entity: Entity, component: Walking) {
    component.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(Walking);

      // console.log('IsWalking', entity.id);

      if (component.status === StateStatus.FINISHED) {
        entity.removeComponent(Walking);
        return;
      }

      if (component.status === StateStatus.NOT_STARTED) {
        this.onEnter(entity, component);
      }

      this.onUpdate(entity, component);

      return true;
    });
  }
}
