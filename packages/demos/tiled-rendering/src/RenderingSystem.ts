import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import IsCollisionTile from "./IsCollisionTile";
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
      const tile = entity.getComponent(IsCollisionTile);
      const point = tile.properties.point;
      dot(this.ctx, point.x, point.y, "rgb(0,255,0)", 6);
      text(this.ctx, `${tile.properties.tile}`, point.x, point.y, "10", "arial", "", "black");
    });

    this.renderQuadTree(this.quadtree);
    text(this.ctx, `fps: ${this.world.fps}`, 520, 430, "30", "sans-serif", "", "black");
    text(this.ctx, `entities: ${this.world.entities.size}`, 470, 460, "30", "sans-serif", "", "black");
  }
}
