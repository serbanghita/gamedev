import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
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
    const entity = this.world.getEntity("player") as Entity;
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
            rectA.resize(rectA.width, rectA.height);
            entityBody.properties.width = rectA.width;
            entityBody.properties.height = rectA.height;
            this.world.removeEntity(otherEntity.id);
          } else {
            rectB.resize(rectB.width, rectB.height);
            otherEntityBody.properties.width = rectB.width;
            otherEntityBody.properties.height = rectB.height;
            this.world.removeEntity(entity.id);
          }
        }
      }
    });
  }

  // public update(now: number): void {
  //   // this.preUpdate();
  //   //
  //   // if (this.isPaused) {
  //   //   return;
  //   // }
  //
  //   this.query.execute().forEach((entity) => {
  //     const entityBody = entity.getComponent(PhysicsBody);
  //     this.quadtree.query(entityBody.properties.rectangle).forEach((point) => {
  //       // Don't attempt to collide with itself.
  //       if (point.id && point.id !== entity.id) {
  //         const otherEntity = this.world.getEntity(point.id);
  //         if (otherEntity) {
  //           const otherEntityBody = otherEntity.getComponent(PhysicsBody);
  //           // Check which entity is bigger.
  //           // a. remove smaller body entity
  //           // b. grow bigger body entity
  //
  //           const rectA = entityBody.properties.rectangle;
  //           const rectB = otherEntityBody.properties.rectangle;
  //
  //           if (rectA.area > rectB.area) {
  //             rectA.resize(rectA.width + 1, rectA.height + 1);
  //             entityBody.properties.width = rectA.width;
  //             entityBody.properties.height = rectA.height;
  //             this.world.removeEntity(otherEntity.id);
  //           } else {
  //             rectB.resize(rectB.width + 1, rectB.height + 1);
  //             otherEntityBody.properties.width = rectB.width;
  //             otherEntityBody.properties.height = rectB.height;
  //             this.world.removeEntity(entity.id);
  //           }
  //         }
  //       }
  //     });
  //   });
  // }
}
