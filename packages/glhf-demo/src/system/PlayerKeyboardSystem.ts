import Entity from "../../../glhf-ecs/src/Entity";
import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import {InputActions, default as KeyboardInput} from "../../../glhf-input/src/Keyboard";
import Keyboard from "../../../glhf-component/src/Keyboard";
import Position from "../../../glhf-component/src/Position";
import State from "../../../glhf-component/src/State";
import Direction, {Directions} from "../../../glhf-component/src/Direction";
import {PlayerState} from "../component/PlayerState";

export function getPrimaryDirectionLiteral(direction: Direction): string {
    let result = 'down';
    if (direction.properties.y === Directions.UP) {
        result = 'up';
    } else if (direction.properties.y === Directions.DOWN) {
        result = 'down';
    }

    if (direction.properties.x === Directions.LEFT) {
        result = 'left';
    } else if (direction.properties.x === Directions.RIGHT) {
        result = 'right';
    }

    return result;
}

export default class PlayerKeyboardSystem extends System {
    public constructor(protected query: Query, protected input: KeyboardInput) {
        super();
    }

    private getDirectionFromKeyboardActions() {
        const direction: Set<Directions> = new Set([]);
        const actions = this.input.ongoingActions;

        if (actions.has(InputActions.MOVE_UP)) {
            direction.add(Directions.UP);
        } else if (actions.has(InputActions.MOVE_DOWN)) {
            direction.add(Directions.DOWN);
        }

        if (actions.has(InputActions.MOVE_LEFT)) {
            direction.add(Directions.LEFT);
        } else if (actions.has(InputActions.MOVE_RIGHT)) {
            direction.add(Directions.RIGHT);
        }

        return direction;
    }

    private doClubAttack(entity: Entity)
    {
        if (!entity.hasComponent(Keyboard) || !this.input.areKeysPressed() || !this.input.ongoingActions.has(InputActions.ACTION_1)) {
            return false;
        }

        const state = entity.getComponent(State);
        state.properties.state = PlayerState.club_attack;

        return true;
    }

    private doMove(entity: Entity) {

        if (!entity.hasComponent(Keyboard) || !this.input.areKeysPressed()) {
            return false;
        }

        const directionFromInput = this.getDirectionFromKeyboardActions();

        const direction = entity.getComponent(Direction);
        const position = entity.getComponent(Position);
        const speed = 3;

        if (directionFromInput.has(Directions.UP)) {
            position.properties.y -= speed;
            direction.properties.y = Directions.UP;
        } else if (directionFromInput.has(Directions.DOWN)) {
            position.properties.y += speed;
            direction.properties.y = Directions.DOWN;
        } else {
            direction.properties.y = Directions.NONE;
        }

        if (directionFromInput.has(Directions.LEFT)) {
            position.properties.x -= speed;
            direction.properties.x = Directions.LEFT;
        } else if (directionFromInput.has(Directions.RIGHT)) {
            position.properties.x += speed;
            direction.properties.x = Directions.RIGHT;
        } else {
            direction.properties.x = Directions.NONE;
        }

        return true;
    }

    public update(now: number): void {
        this.query.execute().forEach((entity) => {
            if (this.doClubAttack(entity)) {
                return;
            }
            const isMoving = this.doMove(entity);
            if (isMoving) {
                const state = entity.getComponent(State);
                state.properties.state = PlayerState.walk;
            }

        });
    }
}