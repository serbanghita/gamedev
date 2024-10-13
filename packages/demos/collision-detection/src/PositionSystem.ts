import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { randomInt } from "./helpers";
import PhysicsBody from "./PhysicsBody";

export default class PositionSystem extends System {
  public update(now: number): void {
    this.preUpdate();

    if (this.isPaused) {
      return;
    }

    this.query.execute().forEach((entity) => {
      const body = entity.getComponent(PhysicsBody);

      const x = randomInt(-2, 2);
      const y = randomInt(-2, 2);

      body.properties.x += x;
      body.properties.y += y;

      body.properties.point.x += x;
      body.properties.point.y += y;
    });
  }
}
