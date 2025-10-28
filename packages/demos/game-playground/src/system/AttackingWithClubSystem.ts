import { System } from "@serbanghita-gamedev/ecs";

import AttackingWithClub from "../component/AttackingWithClub";
import {Idle} from "../component/Idle";

export default class AttackingWithClubSystem extends System {

  public update(): void {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(AttackingWithClub);
      // console.log(component.properties.animationTick);

      if (component.properties.hasFinished) {
        // console.log('AttackingWithClub -> removed');
        // entity.removeComponent(AttackingWithClub);
        entity.addComponent(Idle);
      }

    });
  }
}
