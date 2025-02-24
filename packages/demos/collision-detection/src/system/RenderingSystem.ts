import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { dot, rectangle } from "@serbanghita-gamedev/renderer";
import PhysicsBody from "../component/PhysicsBody";
import IsPlayer from "../component/IsPlayer";

export default class RenderingSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    public ctx: CanvasRenderingContext2D,
  ) {
    super(world, query);
  }
  public update(now: number): void {
    this.ctx.clearRect(0, 0, 640, 480);

    this.query.execute().forEach((entity) => {
      const body = entity.getComponent(PhysicsBody);
      const isPlayer = entity.hasComponent(IsPlayer);

      const rect = body.properties.rectangle;

      const color = isPlayer ? "rgb(0, 255, 0)" : "rgb(255,0,0)";
      rectangle(this.ctx, rect.topLeftX, rect.topLeftY, body.properties.width, body.properties.height, color);
      // rectangle(this.ctx, rect.topLeftX, rect.topLeftY, rect.width, rect.height, "rgb(255,100,0)");
      // dot(this.ctx, rect.center.x - 1, rect.center.y - 1, "black", 2);
    });
  }
}
