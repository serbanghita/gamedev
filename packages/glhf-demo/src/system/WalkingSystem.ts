import Direction, { Directions } from "../../../glhf-component/src/Direction";
import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import {getPrimaryDirectionLiteral} from "./PlayerKeyboardSystem";
import IsIdle from "../component/IsIdle";
import IsWalking from "../component/IsWalking";

export default class WalkingSystem extends System {
    public constructor(public query: Query) {
        super();
    }

    public update(now: number): void {
        this.query.execute().forEach(entity => {
            const direction = entity.getComponent(Direction);
            const state = entity.getComponent(IsWalking);

            if (direction.properties.y === Directions.UP) {
                state.properties.animationState = 'walk_up';
            } else if (direction.properties.y === Directions.DOWN) {
                state.properties.animationState = 'walk_down';
            }

            if (direction.properties.x === Directions.LEFT) {
                state.properties.animationState = 'walk_left';
            } else if (direction.properties.x === Directions.RIGHT) {
                state.properties.animationState = 'walk_right';
            }

            state.properties.stateTick++;
            state.properties.animationTick++;
        });
    }

}