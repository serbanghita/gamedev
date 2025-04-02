import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {GridTile} from "@serbanghita-gamedev/grid";
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
      const tileComp = entity.getComponent(GridTile);
      const tileCompPixelCoords = tileComp.getPixelCoordinates();
      dot(this.ctx, tileCompPixelCoords.x, tileCompPixelCoords.y, "rgb(0,0,0, 0.5)", 2);
    });
  }
}
