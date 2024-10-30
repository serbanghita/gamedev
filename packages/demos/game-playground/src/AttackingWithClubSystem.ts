import { Direction, Directions } from "@serbanghita-gamedev/component";
import { Entity, System } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "./state";

import IsAttackingWithClub from "./IsAttackingWithClub";

export default class AttackingWithClubSystem extends System {
  private onEnter(entity: Entity, component: IsAttackingWithClub) {
    component.properties.tick = 0;
    component.properties.animationTick = 0;
    component.properties.status = StateStatus.STARTED;
  }

  private onUpdate(entity: Entity, component: IsAttackingWithClub) {
    const direction = entity.getComponent(Direction);

    if (component.properties.animationTick === 5) {
      this.onExit(entity, component);
    }

    if (direction.properties.y === Directions.UP) {
      component.properties.animationStateName = "club_attack_one_up";
    } else if (direction.properties.y === Directions.DOWN) {
      component.properties.animationStateName = "club_attack_one_down";
    }

    if (direction.properties.x === Directions.LEFT) {
      component.properties.animationStateName = "club_attack_one_left";
    } else if (direction.properties.x === Directions.RIGHT) {
      component.properties.animationStateName = "club_attack_one_right";
    }

    component.properties.tick++;
    if (component.properties.tick % 15 === 0) {
      component.properties.animationTick += 1;
    }
    // console.log(component.properties.tick);
    // console.log(component.properties.animationTick);
  }

  private onExit(entity: Entity, component: IsAttackingWithClub) {
    component.properties.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(IsAttackingWithClub);

      console.log("IsAttackingWithClub", entity.id);

      if (component.properties.status === StateStatus.FINISHED) {
        entity.removeComponent(IsAttackingWithClub);
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
