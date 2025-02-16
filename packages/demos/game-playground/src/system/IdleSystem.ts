import { Direction } from "@serbanghita-gamedev/component";
import { System, Entity } from "@serbanghita-gamedev/ecs";
import IsIdle from "../component/IsIdle";
import { StateStatus } from "../state";

export default class IdleSystem extends System {
  private onEnter(entity: Entity, component: IsIdle) {
    component.properties.tick = 0;
    component.properties.animationTick = 0;
    component.properties.status = StateStatus.STARTED;
  }

  private onUpdate(entity: Entity, component: IsIdle) {
    // Loop. @todo: move logic
    // if (component.properties.tick === 10) {
    //     this.onEnter(entity, component);
    // }

    const direction = entity.getComponent(Direction);
    const directionLiteral = direction.properties.literal || "";

    // console.log(`idle_${directionLiteral}`);

    component.properties.animationStateName = directionLiteral ? `idle_${directionLiteral}` : "idle";
    component.properties.tick++;
    if (component.properties.tick % 15 === 0) {
      component.properties.animationTick += 1;
    }

    // console.log(component.properties.animationTick);
  }

  private onExit(entity: Entity, component: IsIdle) {
    component.properties.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity: Entity) => {
      const component = entity.getComponent(IsIdle);

      // console.log('IsIdle', entity.id);

      if (component.properties.status === StateStatus.FINISHED) {
        console.log("IsIdle finished and removed");
        entity.removeComponent(IsIdle);
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
