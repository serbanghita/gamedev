import Entity from "../../../glhf-ecs/src/Entity";
import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import State from "../../../glhf-component/src/State";
import {PlayerState} from "../component/PlayerState";
import Direction, { Directions } from "../../../glhf-component/src/Direction";
import {getPrimaryDirectionLiteral} from "./PlayerKeyboardSystem";

export default class PlayerStateSystem extends System {

    public constructor(protected query: Query) {
        super();
    }

    public update(now: number): void {
        this.query.execute().forEach((entity: Entity) => {
            const state = entity.getComponent(State);

            switch (state.properties.state) {
                case PlayerState.idle:
                    this.updateIdleState(entity, state);
                break;
                case PlayerState.club_attack:
                    this.updateClubAttackState(entity, state);
                break;
                case PlayerState.walk:
                    this.updateWalkState(entity, state);
                break;
                default:
                    state.properties.stateTick = 0;
                    state.properties.animationTick = 0;
                    this.updateIdleState(entity, state);

            }
        });
    }

    protected updateIdleState(entity: Entity, state: State) {
        const direction = entity.getComponent(Direction);
        const dir = getPrimaryDirectionLiteral(direction);

        console.log(`idle_${dir}`);

        state.properties.state = 'idle';
        state.properties.animationState = `idle_${dir}`;
        state.properties.stateTick++;
        state.properties.animationTick++;
    }

    protected updateWalkState(entity: Entity, state: State) {
        const direction = entity.getComponent(Direction);

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
    }

    protected updateClubAttackState(entity: Entity, state: State) {
        const direction = entity.getComponent(Direction);

        if (direction.properties.y === Directions.UP) {
            state.properties.animationState = 'club_attack_one_up';
        } else if (direction.properties.y === Directions.DOWN) {
            state.properties.animationState = 'club_attack_one_down';
        }

        if (direction.properties.x === Directions.LEFT) {
            state.properties.animationState = 'club_attack_one_left';
        } else if (direction.properties.x === Directions.RIGHT) {
            state.properties.animationState = 'club_attack_one_right';
        }

        state.properties.stateTick++;
        state.properties.animationTick++;
    }
}