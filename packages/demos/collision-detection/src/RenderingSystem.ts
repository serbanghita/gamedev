import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { Position } from "@serbanghita-gamedev/component";
import { dot } from "@serbanghita-gamedev/renderer";

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
      const position = entity.getComponent(Position);

      dot(this.ctx, position.properties.x, position.properties.y, "rgb(255,0,0)", 4);
    });
  }
}
