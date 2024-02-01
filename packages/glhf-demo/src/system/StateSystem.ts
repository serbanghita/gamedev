import Entity from "../../../glhf-ecs/src/Entity";
import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import IsIdle from "../component/IsIdle";
import IsWalking from "../component/IsWalking";

export default class StateSystem extends System {

    public constructor(public query: Query) {
        super();
    }

    public update(now: number): void {
        this.query.execute().forEach((entity: Entity) => {
            const isIdleState = entity.hasComponent(IsIdle);
            const isWalkingState = entity.hasComponent(IsWalking);

            if (!isWalkingState) {
                if (!isIdleState) {
                    entity.addComponent(IsIdle);
                }
            }
        });
    }

    // protected updateClubAttackState(entity: Entity, state: State) {
    //     const direction = entity.getComponent(Direction);
    //
    //     if (direction.properties.y === Directions.UP) {
    //         state.properties.animationState = 'club_attack_one_up';
    //     } else if (direction.properties.y === Directions.DOWN) {
    //         state.properties.animationState = 'club_attack_one_down';
    //     }
    //
    //     if (direction.properties.x === Directions.LEFT) {
    //         state.properties.animationState = 'club_attack_one_left';
    //     } else if (direction.properties.x === Directions.RIGHT) {
    //         state.properties.animationState = 'club_attack_one_right';
    //     }
    //
    //     state.properties.stateTick++;
    //     state.properties.animationTick++;
    // }
}