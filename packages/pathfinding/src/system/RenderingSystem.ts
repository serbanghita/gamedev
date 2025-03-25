import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Tile} from "@serbanghita-gamedev/component";
import { dot, rectangle, text } from "@serbanghita-gamedev/renderer";

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
      const tileComp = entity.getComponent(Tile);

      dot(this.ctx, tileComp.x, tileComp.y, "rgb(0,255,0)", 6);
      text(this.ctx, `${tileComp.tile}`, tileComp.x, tileComp.y, "9", "arial", "", "black");
    });

    // debug
    text(this.ctx, `fps: ${this.world.fps}`, 440, 420, "20", "serif", "", "black");
    text(this.ctx, `frame duration: ${this.world.frameDuration}`, 440, 440, "20", "serif", "", "black");
    text(this.ctx, `fps cap: ${this.world.fpsCap}`, 440, 460, "20", "serif", "", "black");
    text(this.ctx, `frame no: ${this.world.frameNo}`, 440, 480, "20", "serif", "", "black");
  }
}
