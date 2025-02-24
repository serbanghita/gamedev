import { Direction, Directions } from "@serbanghita-gamedev/component";
import { Entity, System } from "@serbanghita-gamedev/ecs";
import { StateStatus } from "../state";

import AttackingWithClub from "../component/AttackingWithClub";

export default class AttackingWithClubSystem extends System {
  private lastFrameTime: DOMHighResTimeStamp = 0;

  private onEnter(entity: Entity, component: AttackingWithClub) {
    component.init();
  }

  private onUpdate(entity: Entity, component: AttackingWithClub) {
    const direction = entity.getComponent(Direction);

    if (component.animationTick === 4) {
      this.onExit(entity, component);
    }

    if (direction.y === Directions.UP) {
      component.animationStateName = "club_attack_one_up";
    } else if (direction.y === Directions.DOWN) {
      component.animationStateName = "club_attack_one_down";
    }

    if (direction.x === Directions.LEFT) {
      component.animationStateName = "club_attack_one_left";
    } else if (direction.x === Directions.RIGHT) {
      component.animationStateName = "club_attack_one_right";
    }

    if (this.world.now - this.lastFrameTime >= 50) {
      component.animationTick += 1;
      this.lastFrameTime = this.world.now;
    }
  }

  private onExit(entity: Entity, component: AttackingWithClub) {
    component.status = StateStatus.FINISHED;
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(AttackingWithClub);

      console.log("IsAttackingWithClub", entity.id);

      if (component.status === StateStatus.FINISHED) {
        entity.removeComponent(AttackingWithClub);
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
