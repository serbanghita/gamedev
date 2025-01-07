import { Direction, Directions } from "@serbanghita-gamedev/component";
import { System, Entity } from "@serbanghita-gamedev/ecs";
import IsWalking from "./IsWalking";
import {StateStatus} from "./state";

export default class WalkingSystem extends System {

    private onEnter(entity: Entity, component: IsWalking)
    {
        component.properties.tick = 0;
        component.properties.animationTick = 0;
        component.properties.status = StateStatus.STARTED;
    }

    private onUpdate(entity: Entity, component: IsWalking)
    {
        const direction = entity.getComponent(Direction);

        if (direction.properties.y === Directions.UP) {
            component.properties.animationStateName = 'walk_up';
        } else if (direction.properties.y === Directions.DOWN) {
            component.properties.animationStateName = 'walk_down';
        }

        if (direction.properties.x === Directions.LEFT) {
            component.properties.animationStateName = 'walk_left';
        } else if (direction.properties.x === Directions.RIGHT) {
            component.properties.animationStateName = 'walk_right';
        }

        component.properties.tick++;
        if (component.properties.tick % 15 === 0) {
            component.properties.animationTick += 1;
        }
        // console.log(component.properties.tick);
        // console.log(component.properties.animationTick);
    }

    private onExit(entity: Entity, component: IsWalking) {
        component.properties.status = StateStatus.FINISHED;
    }

    public update(now: number): void {
        this.query.execute().forEach(entity => {
            const component = entity.getComponent(IsWalking);

            // console.log('IsWalking', entity.id);

            if (component.properties.status === StateStatus.FINISHED) {
                entity.removeComponent(IsWalking);
                return;
            }

            if (component.properties.status === StateStatus.NOT_STARTED) {
                this.onEnter(entity, component);
            }

            this.onUpdate(entity, component);

            return true;
        });
    }

}