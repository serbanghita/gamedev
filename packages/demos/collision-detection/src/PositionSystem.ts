import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { Position } from "@serbanghita-gamedev/component";
import { randomInt } from "./helpers";

export default class PositionSystem extends System {
  public update(now: number): void {
    this.ticks++;

    if (this.settings.runEveryTicks > 0) {
      if (this.ticks < this.settings.runEveryTicks) {
        return;
      } else {
        this.ticks = 0;
      }
    }

    this.query.execute().forEach((entity) => {
      const position = entity.getComponent(Position);

      position.properties.x += randomInt(-2, 2);
      position.properties.y += randomInt(-2, 2);
    });
  }
}
