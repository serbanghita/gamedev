import Direction from "../../../glhf-component/src/Direction";
import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import {getPrimaryDirectionLiteral} from "./PlayerKeyboardSystem";
import IsIdle from "../component/IsIdle";

export default class IdleSystem extends System {
    public constructor(public query: Query) {
        super();
    }

    public update(now: number): void {
        this.query.execute().forEach(entity => {
            const direction = entity.getComponent(Direction);
            const state = entity.getComponent(IsIdle);
            const dir = getPrimaryDirectionLiteral(direction);

            console.log(`idle_${dir}`);

            state.properties.state = 'idle';
            state.properties.animationState = `idle_${dir}`;
            state.properties.stateTick++;
            state.properties.animationTick++;
        });
    }

}