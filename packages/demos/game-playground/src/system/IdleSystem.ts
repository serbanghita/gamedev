import { System, Entity } from "@serbanghita-gamedev/ecs";

export default class IdleSystem extends System {

  public update(now: number): void {
    this.query.execute().forEach((entity: Entity) => {
      // const component = entity.getComponent(Idle);

      return true;
    });
  }
}
