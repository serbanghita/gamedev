import { Direction } from "@serbanghita-gamedev/component";
import { System, Entity } from "@serbanghita-gamedev/ecs";
import Idle from "../component/Idle";
import { StateStatus } from "../state";

export default class IdleSystem extends System {
  private lastFrameTime: number = 0;

  private onEnter(entity: Entity, component: Idle) {
    component.init();
  }

  private onUpdate(entity: Entity, component: Idle) {
    const direction = entity.getComponent(Direction);

    component.animationStateName = direction.literal ? `idle_${direction.literal}` : "idle";

    console.log(component.animationStateName);

    if (this.world.now - this.lastFrameTime >= 120) {
      component.animationTick += 1;
      this.lastFrameTime = this.world.now;
    }
  }

  private onExit(entity: Entity, component: Idle) {
    component.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity: Entity) => {
      const component = entity.getComponent(Idle);

      // console.log('IsIdle', entity.id);

      if (component.status === StateStatus.FINISHED) {
        console.log("IsIdle finished and removed");
        entity.removeComponent(Idle);
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
