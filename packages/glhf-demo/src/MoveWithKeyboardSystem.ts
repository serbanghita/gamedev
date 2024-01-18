import Entity from "../../glhf-ecs/src/Entity";
import Query from "../../glhf-ecs/src/Query";
import System from "../../glhf-ecs/src/System";
import {InputActions, default as KeyboardInput} from "../../glhf-input/src/Keyboard";
import Keyboard from "../../glhf-component/src/Keyboard";
import Position from "../../glhf-component/src/Position";
import State from "../../glhf-component/src/State";
import Direction, {Directions} from "../../glhf-component/src/Direction";

enum InputDirections {
    NONE, UP, DOWN, LEFT, RIGHT
}

export default class MoveWithKeyboardSystem extends System {
    public constructor(protected query: Query, protected input: KeyboardInput) {
        super();
    }

    private getDirectionFromKeyboardActions() {
        const direction: Set<InputDirections> = new Set([]);
        const actions = this.input.ongoingActions;

        if (actions.has(InputActions.MOVE_UP)) {
            direction.add(InputDirections.UP);
        } else if (actions.has(InputActions.MOVE_DOWN)) {
            direction.add(InputDirections.DOWN);
        }

        if (actions.has(InputActions.MOVE_LEFT)) {
            direction.add(InputDirections.LEFT);
        } else if (actions.has(InputActions.MOVE_RIGHT)) {
            direction.add(InputDirections.RIGHT);
        }

        return direction;
    }

    private moveWithKeyboard(entity: Entity) {
        if (entity.hasComponent(Keyboard)) {
            if (this.input.areKeysPressed()) {
                const directionFromInput = this.getDirectionFromKeyboardActions();

                const position = entity.getComponent(Position);
                const direction = entity.getComponent(Direction);

                if (directionFromInput.has(InputDirections.UP)) {
                    position.properties.y -= 1;
                    direction.properties.y = Directions.UP;
                } else if (directionFromInput.has(InputDirections.DOWN)) {
                    position.properties.y += 1;
                    direction.properties.y = Directions.DOWN;
                } else {
                    direction.properties.y = Directions.NONE;
                }


                if (directionFromInput.has(InputDirections.LEFT)) {
                    position.properties.x -= 1;
                    direction.properties.x = Directions.LEFT;
                } else if (directionFromInput.has(InputDirections.RIGHT)) {
                    position.properties.x += 1;
                    direction.properties.x = Directions.RIGHT;
                } else {
                    direction.properties.x = Directions.NONE;
                }

                console.log(position.properties, direction.properties);
            } else {
                // Look at the last state e.g. "walk_down" and set the state "idle_down".
            }
        }
    }

    private updateState(entity: Entity)
    {
        const direction = entity.getComponent(Direction);
        const state = entity.getComponent(State);

        if (direction.properties.x === Directions.NONE && direction.properties.y === Directions.NONE) {
            state.properties.updateStateName = 'idle';
            state.properties.animationFrameName = 'idle_up';
            return;
        }

        if (direction.properties.y === Directions.UP) {
            state.properties.updateStateName = 'walk_up';
            state.properties.animationFrameName = 'walk_up';
        } else if (direction.properties.y === Directions.DOWN) {
            state.properties.updateStateName = 'walk_down';
            state.properties.animationFrameName = 'walk_down';
        }

        if (direction.properties.x === Directions.LEFT) {
            state.properties.updateStateName = 'walk_left';
            state.properties.animationFrameName = 'walk_left';
        } else if (direction.properties.x === Directions.RIGHT) {
            state.properties.updateStateName = 'walk_right';
            state.properties.animationFrameName = 'walk_right';
        }

        state.properties.updateStateTick++;
        state.properties.animationFrameTick++;
    }

    public update(now: number): void {
        this.query.execute().forEach((entity) => {
            this.moveWithKeyboard(entity);
            this.updateState(entity);
        });
    }
}