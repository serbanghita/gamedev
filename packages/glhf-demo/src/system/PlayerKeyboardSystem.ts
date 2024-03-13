import Entity from "@glhf/ecs/Entity";
import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import {InputActions, default as KeyboardInput} from "../../../glhf-input/src/Keyboard";
import Keyboard from "../../../glhf-component/src/Keyboard";
import Position from "../../../glhf-component/src/Position";
import Direction, {Directions} from "../../../glhf-component/src/Direction";
import IsWalking from "../component/IsWalking";
import IsIdle from "../component/IsIdle";
import World from "../../../glhf-ecs/src/World";
import {StateStatus} from "../state/state-status";
import IsAttackingWithClub from "../component/IsAttackingWithClub";

export default class PlayerKeyboardSystem extends System {
    private directionsFromInput: Set<Directions> = new Set([]);
    private directionLiteral: 'up' | 'down' | 'left' | 'right' | '' = '';

    public constructor(public world: World, public query: Query, protected input: KeyboardInput) {
        super(world, query);
    }

    private setDirectionFromKeyboardActions() {
        const actions = this.input.ongoingActions;
        this.directionsFromInput.clear();
        this.directionLiteral = '';
        let isDirty = false;

        if (actions.has(InputActions.MOVE_UP)) {
            this.directionsFromInput.add(Directions.UP);
            this.directionLiteral = 'up';
            isDirty = true;
        } else if (actions.has(InputActions.MOVE_DOWN)) {
            this.directionsFromInput.add(Directions.DOWN);
            this.directionLiteral = 'down';
            isDirty = true;
        }

        if (actions.has(InputActions.MOVE_LEFT)) {
            this.directionsFromInput.add(Directions.LEFT);
            this.directionLiteral = 'left';
            isDirty = true;
        } else if (actions.has(InputActions.MOVE_RIGHT)) {
            this.directionsFromInput.add(Directions.RIGHT);
            this.directionLiteral = 'right';
            isDirty = true;
        }

        return isDirty;
    }

    private doAction1(entity: Entity)
    {
        // if (entity.hasComponent(IsAction)) {
        //     return false;
        // }

        if (!entity.hasComponent(Keyboard) || !this.input.areKeysPressed() || !this.input.ongoingActions.has(InputActions.ACTION_1)) {
            return false;
        }

        // entity.addComponent(IsAction, {
        //     action: "AttackingWithClub",
        //     direction: this.directionLiteral,
        //     status: 'STARTED'
        // });
        //
        // // @todo: make dynamic from Keyboard settings.
        // entity.addComponent(AttackingWithClub, {
        //     state: 'AttackingWithClub',
        //     animationState: `club_swipe_down_from_${this.directionLiteral}`,
        //     stateTick: 0,
        //     animationTick: 0
        // });

        return true;
    }

    private onEnter(entity: Entity, component: IsWalking)
    {
        component.properties.tick = 0;
        component.properties.animationTick = 0;
        component.properties.status = StateStatus.STARTED;
    }

    private onUpdate(entity: Entity, component: IsWalking)
    {
        if (!entity.hasComponent(Keyboard) || !this.input.areKeysPressed()) {
            this.onExit(entity, component);
            return false;
        }

        const direction = entity.getComponent(Direction);

        if (this.setDirectionFromKeyboardActions()) {
            direction.properties.literal = this.directionLiteral;
        }

        const position = entity.getComponent(Position);
        const speed = 1;

        if (this.directionsFromInput.has(Directions.UP)) {
            position.properties.y -= speed;
            direction.properties.y = Directions.UP;
        } else if (this.directionsFromInput.has(Directions.DOWN)) {
            position.properties.y += speed;
            direction.properties.y = Directions.DOWN;
        } else {
            direction.properties.y = Directions.NONE;
        }

        if (this.directionsFromInput.has(Directions.LEFT)) {
            position.properties.x -= speed;
            direction.properties.x = Directions.LEFT;
        } else if (this.directionsFromInput.has(Directions.RIGHT)) {
            position.properties.x += speed;
            direction.properties.x = Directions.RIGHT;
        } else {
            direction.properties.x = Directions.NONE;
        }
    }

    private onExit(entity: Entity, component: IsWalking) {
        component.properties.status = StateStatus.FINISHED;
        if (entity.hasComponent(IsWalking)) {
            entity.removeComponent(IsWalking);
        }
    }

    public update(now: number): void {
        this.query.execute().forEach((entity) => {

            if (this.input.ongoingActions.has(InputActions.ACTION_1)) {
                entity.removeComponent(IsWalking);
                entity.addComponent(IsAttackingWithClub);
                return;
            }

            if (!this.input.areMovementKeysPressed()) {
                if (entity.hasComponent(IsWalking)) {
                    entity.removeComponent(IsWalking);
                    entity.addComponent(IsIdle);
                }
                return;
            }

            if (!entity.hasComponent(IsWalking)) {
                entity.addComponent(IsWalking);
                entity.removeComponent(IsIdle);
            }

            const component = entity.getComponent(IsWalking);

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