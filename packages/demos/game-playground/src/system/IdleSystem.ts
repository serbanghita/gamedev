import { Direction } from "@serbanghita-gamedev/component";
import { System, Entity } from "@serbanghita-gamedev/ecs";
import { Idle } from "../component/Idle";
import { StateStatus } from "../state";

export default class IdleSystem extends System {

  private onEnter(entity: Entity, component: Idle) {
    component.init();
  }

  private onUpdate(entity: Entity, component: Idle) {
    const direction = entity.getComponent(Direction);

    // console.log(direction);

    component.properties.animationStateName = direction.literal ? `idle_${direction.literal}` : "idle";

    if (this.world.now - component.properties.lastFrameTime >= 120) {
      component.properties.animationTick += 1;
      // Update time for each entity's component.
      component.properties.lastFrameTime = this.world.now;
    }
  }

  private onExit(entity: Entity, component: Idle) {
    component.properties.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity: Entity) => {
      const component = entity.getComponent(Idle);

      // console.log('IsIdle', entity.id);

      if (component.properties.status === StateStatus.FINISHED) {
        entity.removeComponent(Idle);
        return;
      }

      if (component.properties.status === StateStatus.NOT_STARTED) {
        this.onEnter(entity, component);
      }

      this.onUpdate(entity, component);

      return true;
    });
  }
}
