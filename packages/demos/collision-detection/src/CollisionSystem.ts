import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import PhysicsBody from "./PhysicsBody";

export default class CollisionSystem extends System {
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

    this.query.execute().forEach((entity) => {
      const entityBody = entity.getComponent(PhysicsBody);
      this.quadtree.query(entityBody.properties.rectangle).forEach((point) => {
        // Don't attempt to collide with itself.
        if (point.id && point.id !== entity.id) {
          const otherEntity = this.world.getEntity(point.id);
          if (otherEntity) {
            const otherEntityBody = otherEntity.getComponent(PhysicsBody);
            // Check which entity is bigger.
            // a. remove smaller body entity
            // b. grow bigger body entity

            const rectA = entityBody.properties.rectangle;
            const rectB = otherEntityBody.properties.rectangle;

            if (rectA.area > rectB.area) {
              rectA.resize(rectA.width + 10, rectA.height + 10);
              entityBody.properties.width = rectA.width;
              entityBody.properties.height = rectA.height;
              this.world.removeEntity(otherEntity.id);
            } else {
              rectB.resize(rectB.width + 10, rectB.height + 10);
              otherEntityBody.properties.width = rectB.width;
              otherEntityBody.properties.height = rectB.height;
              this.world.removeEntity(entity.id);
            }
          }
        }
      });
    });
  }
}
