import { Entity, Query, System, World } from "@serbanghita-gamedev/ecs";
import { InputActions, Keyboard as KeyboardInput } from "@serbanghita-gamedev/input";
import { Keyboard, Direction, Directions } from "@serbanghita-gamedev/component";
import { Walking } from "../component/Walking";
import { Idle } from "../component/Idle";
import AttackingWithClub from "../component/AttackingWithClub";
import { StateStatus } from "../state";

export default class PlayerKeyboardSystem extends System {
  // private directionsFromInput: Set<Directions> = new Set([]);
  // private directionLiteral: "up" | "down" | "left" | "right" | "" = "";

  public constructor(public world: World, public query: Query, protected input: KeyboardInput) {
    super(world, query);
  }

  private setDirectionFromKeyboardActions(entity: Entity) {
    const direction = entity.getComponent(Direction);
    const actions = this.input.ongoingActions;

    if (actions.has(InputActions.MOVE_UP)) {
      direction.setY(Directions.UP);
    } else if (actions.has(InputActions.MOVE_DOWN)) {
      direction.setY(Directions.DOWN);
    } else {
      direction.setY(Directions.NONE);
    }

    if (actions.has(InputActions.MOVE_LEFT)) {
      direction.setX(Directions.LEFT);
    } else if (actions.has(InputActions.MOVE_RIGHT)) {
      direction.setX(Directions.RIGHT);
    } else {
      direction.setX(Directions.NONE);
    }

    //console.log(direction.literal);

  }

  private doAction1(entity: Entity) {
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

  private onEnter(entity: Entity, component: Walking) {
    component.init();
  }

  private onUpdate(entity: Entity, component: Walking) {
    if (!entity.hasComponent(Keyboard) || !this.input.areKeysPressed()) {
      this.onExit(entity, component);
      return false;
    }

    this.setDirectionFromKeyboardActions(entity);
  }

  private onExit(entity: Entity, component: Walking) {
    component.properties.status = StateStatus.FINISHED;
    if (entity.hasComponent(Walking)) {
      entity.removeComponent(Walking);
    }
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      // if (this.input.ongoingActions.has(InputActions.ACTION_1)) {
      //   if (!entity.getComponent(Keyboard).keys.action_1) {
      //     return;
      //   }
      //
      //   console.log('PlayerKeyboardSystem -> action_1');
      //
      //   if (entity.hasComponent(Walking)) {
      //     entity.removeComponent(Walking);
      //   }
      //   if (!entity.hasComponent(AttackingWithClub)) {
      //     entity.addComponent(AttackingWithClub);
      //   }
      //   return;
      // }

      if (!this.input.areMovementKeysPressed()) {
        if (entity.hasComponent(Walking)) {
          //console.log('no keys pressed, remove Walking, add Idle');
          entity.removeComponent(Walking);
          const direction = entity.getComponent(Direction);
          //console.log(direction.literal);
          entity.addComponent(Idle, { ...Idle.defaultProps, animationStateName: `idle_${direction.literal}` });
        }
        return;
      }

      if (!entity.hasComponent(Walking)) {
        //console.log('add Walking');
        entity.addComponent(Walking, Walking.defaultProps);
        // entity.removeComponent(IsIdle);
      }

      const component = entity.getComponent(Walking);

      if (component.properties.status === StateStatus.FINISHED) {
        //console.log('FINISHED, remove Walking');
        entity.removeComponent(Walking);
        return;
      }

      if (component.properties.status === StateStatus.NOT_STARTED) {
        //console.log('NOT_STARTED, onEnter');
        this.onEnter(entity, component);
      }

      //console.log('onUpdate');
      this.onUpdate(entity, component);

      return true;
    });
  }
}
