import { System, Query, World } from "@serbanghita-gamedev/ecs";
import {GridTile} from "@serbanghita-gamedev/grid";
import { dot, text } from "@serbanghita-gamedev/renderer";
import TileToBeExplored from "../component/TileToBeExplored";
import TileIsInThePathFound from "../component/TileIsInThePathFound";

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
      const tileComp = entity.getComponent(GridTile);
      const tileCompPixelCoords = tileComp.getPixelCoordinates();

      if (entity.hasComponent(TileToBeExplored)) {
        dot(this.ctx, tileCompPixelCoords.x + 4, tileCompPixelCoords.y + 4, "rgb(0,255,0)", 6);
        text(this.ctx, `${tileComp.tile}`, tileCompPixelCoords.x, tileCompPixelCoords.y + 8, "9", "arial", "", "black");
      }
      if (entity.hasComponent(TileIsInThePathFound)) {
        dot(this.ctx, tileCompPixelCoords.x + 4, tileCompPixelCoords.y + 4, "rgb(0,0,0)", 6);
      }
    });

    // debug
    text(this.ctx, `fps: ${this.world.fps}`, 440, 420, "20", "serif", "", "black");
    text(this.ctx, `frame duration: ${this.world.frameDuration}`, 440, 440, "20", "serif", "", "black");
    text(this.ctx, `fps cap: ${this.world.fpsCap}`, 440, 460, "20", "serif", "", "black");
    text(this.ctx, `frame no: ${this.world.frameNo}`, 440, 480, "20", "serif", "", "black");
  }
}
