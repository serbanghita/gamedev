import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { GridTile, Grid } from "@serbanghita-gamedev/grid";
import { dot } from "@serbanghita-gamedev/renderer";
import { getPixelCoordinatesFromTile } from "@serbanghita-gamedev/grid/utils.ts";

export default class PreRenderCollisionTilesSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    public ctx: CanvasRenderingContext2D,
  ) {
    super(world, query);
  }

  public update(): void {
    const map = this.world.getEntity("map") as Entity;
    const grid = map.getComponent(Grid);

    this.query.execute().forEach((entity: Entity) => {
      const tileComp = entity.getComponent(GridTile);
      const tileCompPixelCoords = getPixelCoordinatesFromTile(tileComp.tile, grid.config);
      dot(this.ctx, tileCompPixelCoords.x + 4, tileCompPixelCoords.y + 4, "rgb(0,0,0, 0.5)", 2);
    });
  }
}
