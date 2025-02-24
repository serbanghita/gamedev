import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Tile} from "@serbanghita-gamedev/component";
import { dot, rectangle, text } from "@serbanghita-gamedev/renderer";
import { QuadTree } from "@serbanghita-gamedev/quadtree";

export default class RenderingSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    public ctx: CanvasRenderingContext2D,
    public quadtree: QuadTree,
  ) {
    super(world, query);
  }

  private renderQuadTree(quadtree: QuadTree) {
    rectangle(this.ctx, quadtree.area.topLeftX, quadtree.area.topLeftY, quadtree.area.width, quadtree.area.height, "rgba(0,0,0,0.5)");

    Object.values(quadtree.quadrants).forEach((subQuadtree) => {
      this.renderQuadTree(subQuadtree);
    });
  }

  public update(now: number): void {
    this.ctx.clearRect(0, 0, 640, 480);

    this.query.execute().forEach((entity) => {
      const tileComp = entity.getComponent(Tile);

      dot(this.ctx, tileComp.x, tileComp.y, "rgb(0,255,0)", 6);
      text(this.ctx, `${tileComp.tile}`, tileComp.x, tileComp.y, "10", "arial", "", "black");
    });

    this.renderQuadTree(this.quadtree);

    // debug
    text(this.ctx, `fps: ${this.world.fps}`, 440, 420, "20", "serif", "", "black");
    text(this.ctx, `frame duration: ${this.world.frameDuration}`, 440, 440, "20", "serif", "", "black");
    text(this.ctx, `fps cap: ${this.world.fpsCap}`, 440, 460, "20", "serif", "", "black");
    text(this.ctx, `frame no: ${this.world.frameNo}`, 440, 480, "20", "serif", "", "black");
  }
}
