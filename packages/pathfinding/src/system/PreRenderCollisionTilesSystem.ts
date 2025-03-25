import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Tile} from "@serbanghita-gamedev/component";
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
    this.query.execute().forEach((entity: Entity) => {
      const tile = entity.getComponent(Tile);
      dot(this.ctx, tile.x, tile.y, "rgb(0,0,0, 0.5)", 2);
    });
  }
}
