import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import IsCollisionTile from "./IsCollisionTile";
import { dot } from "@serbanghita-gamedev/renderer";

export default class PreRenderCollisionTilesSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    public ctx: CanvasRenderingContext2D,
  ) {
    super(world, query);
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      const tile = entity.getComponent(IsCollisionTile);
      const point = tile.properties.point;
      dot(this.ctx, point.x, point.y, "rgb(255,0,0)", 2);
    });
  }
}
