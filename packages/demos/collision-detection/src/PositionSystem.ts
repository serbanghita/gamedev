import { System } from "@serbanghita-gamedev/ecs";
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

      let x = randomInt(-2, 2);
      let y = randomInt(-2, 2);

      // Don't let entities go offscreen.
      if (body.properties.point.x + x >= 640 || body.properties.point.x + x <= 0) {
        x = 0;
      }
      if (body.properties.point.y + y >= 480 || body.properties.point.y + y <= 0) {
        y = 0;
      }

      body.properties.x += x;
      body.properties.y += y;

      body.properties.point.x += x;
      body.properties.point.y += y;
    });
  }
}
