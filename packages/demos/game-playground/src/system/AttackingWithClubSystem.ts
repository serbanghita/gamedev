import { System } from "@serbanghita-gamedev/ecs";

import AttackingWithClub from "../component/AttackingWithClub";

export default class AttackingWithClubSystem extends System {

  public update(): void {
    this.query.execute().forEach((entity) => {
      const component = entity.getComponent(AttackingWithClub);

      if (component.properties.hasFinished) {
        entity.removeComponent(AttackingWithClub);
      }

    });
  }
}
