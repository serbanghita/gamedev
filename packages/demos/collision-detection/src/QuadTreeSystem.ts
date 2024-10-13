import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import PhysicsBody from "./PhysicsBody";

export default class QuadTreeSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    public quadtree: QuadTree,
  ) {
    super(world, query);
  }
  public update(now: number): void {
    this.preUpdate();

    if (this.isPaused) {
      return;
    }

    this.quadtree.clear();

    this.query.execute().forEach((entity) => {
      const body = entity.getComponent(PhysicsBody);
      this.quadtree.addPoint(body.properties.point);
    });
  }
}
