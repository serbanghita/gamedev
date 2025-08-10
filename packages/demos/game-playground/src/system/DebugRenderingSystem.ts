import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { GridTile, getPixelCoordinatesFromTile, Grid } from "@serbanghita-gamedev/grid";
import { dot, text, rectangle } from "@serbanghita-gamedev/renderer";
// import TileToBeExplored from "../component/TileToBeExplored";
import TileIsInThePathFound from "../component/TileIsInThePathFound";
import TileToBeExplored from "../component/TileToBeExplored";
import Player from "../component/Player";

export default class DebugRenderingSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    public ctx: CanvasRenderingContext2D,
  ) {
    super(world, query);
  }

  public update(now: number): void {
    // this.ctx.clearRect(0, 0, 640, 480);
    const map = this.world.getEntity("map") as Entity;
    const grid = map.getComponent(Grid);

    this.query.execute().forEach((entity) => {
      const tileComp = entity.getComponent(GridTile);
      const tileCompPixelCoords = getPixelCoordinatesFromTile(tileComp.tile, grid.config);

      if (entity.hasComponent(Player)) {
        rectangle(this.ctx, tileCompPixelCoords.x, tileCompPixelCoords.y, 16, 16, "red", "black");
      }

      // if (entity.hasComponent(TileToBeExplored)) {
      //   const tComp = entity.getComponent(TileToBeExplored);
      // //   dot(this.ctx, tileCompPixelCoords.x + 8, tileCompPixelCoords.y + 6, "rgb(0,255,0)", 2);
      // //   // text(this.ctx, `${tileComp}`, tileCompPixelCoords.x + 4, tileCompPixelCoords.y + 8, "9", "arial", "", "#cccccc");
      //   text(this.ctx, `${tComp.fCost}`, tileCompPixelCoords.x + 4, tileCompPixelCoords.y + 8, "9", "arial", "", "#cccccc");
      //   rectangle(this.ctx, tileCompPixelCoords.x, tileCompPixelCoords.y, 16, 16, "grey");
      // }
      if (entity.hasComponent(TileIsInThePathFound)) {
        //dot(this.ctx, tileCompPixelCoords.x + 5, tileCompPixelCoords.y + 10, "rgb(0,0,0)", 10);
        rectangle(this.ctx, tileCompPixelCoords.x, tileCompPixelCoords.y, 16, 16, "rgba(0,0,0,0.5)", "rgba(0,255,0,0.5)");
      }
    });

    // debug
    // text(this.ctx, `fps: ${this.world.fps}`, 440, 420, "20", "serif", "", "black");
    // text(this.ctx, `frame duration: ${this.world.frameDuration}`, 440, 440, "20", "serif", "", "black");
    // text(this.ctx, `fps cap: ${this.world.fpsCap}`, 440, 460, "20", "serif", "", "black");
    // text(this.ctx, `frame no: ${this.world.frameNo}`, 440, 480, "20", "serif", "", "black");
  }
}
