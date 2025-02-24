import { Entity, Query, System, World } from "@serbanghita-gamedev/ecs";
import { InputActions, Keyboard as KeyboardInput } from "@serbanghita-gamedev/input";
import { Keyboard, Position, Direction, Directions } from "@serbanghita-gamedev/component";
import Walking from "../component/Walking";
import Idle from "../component/Idle";
import AttackingWithClub from "../component/AttackingWithClub";
import { StateStatus } from "../state";

export default class PlayerKeyboardSystem extends System {
  private directionsFromInput: Set<Directions> = new Set([]);
  private directionLiteral: "up" | "down" | "left" | "right" | "" = "";

  public constructor(
    public world: World,
    public query: Query,
    protected input: KeyboardInput,
  ) {
    super(world, query);
  }

  private setDirectionFromKeyboardActions() {
    const actions = this.input.ongoingActions;
    this.directionsFromInput.clear();
    this.directionLiteral = "";
    let isDirty = false;

    if (actions.has(InputActions.MOVE_UP)) {
      this.directionsFromInput.add(Directions.UP);
      this.directionLiteral = "up";
      isDirty = true;
    } else if (actions.has(InputActions.MOVE_DOWN)) {
      this.directionsFromInput.add(Directions.DOWN);
      this.directionLiteral = "down";
      isDirty = true;
    }

    if (actions.has(InputActions.MOVE_LEFT)) {
      this.directionsFromInput.add(Directions.LEFT);
      this.directionLiteral = "left";
      isDirty = true;
    } else if (actions.has(InputActions.MOVE_RIGHT)) {
      this.directionsFromInput.add(Directions.RIGHT);
      this.directionLiteral = "right";
      isDirty = true;
    }

    return isDirty;
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

    const direction = entity.getComponent(Direction);

    if (this.setDirectionFromKeyboardActions()) {
      direction.literal = this.directionLiteral;
    }

    const position = entity.getComponent(Position);
    const speed = 1;

    if (this.directionsFromInput.has(Directions.UP)) {
      position.point.y -= speed;
      direction.y = Directions.UP;
    } else if (this.directionsFromInput.has(Directions.DOWN)) {
      position.point.y += speed;
      direction.y = Directions.DOWN;
    } else {
      direction.y = Directions.NONE;
    }

    if (this.directionsFromInput.has(Directions.LEFT)) {
      position.point.x -= speed;
      direction.x = Directions.LEFT;
    } else if (this.directionsFromInput.has(Directions.RIGHT)) {
      position.point.x += speed;
      direction.x = Directions.RIGHT;
    } else {
      direction.x = Directions.NONE;
    }
  }

  private onExit(entity: Entity, component: Walking) {
    component.status = StateStatus.FINISHED;
    if (entity.hasComponent(Walking)) {
      entity.removeComponent(Walking);
    }
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      if (this.input.ongoingActions.has(InputActions.ACTION_1)) {
        if (!entity.getComponent(Keyboard).keys.action_1) {
          return;
        }

        console.log('PlayerKeyboardSystem -> action_1');

        if (entity.hasComponent(Walking)) {
          entity.removeComponent(Walking);
        }
        if (!entity.hasComponent(AttackingWithClub)) {
          entity.addComponent(AttackingWithClub);
        }
        return;
      }

      if (!this.input.areMovementKeysPressed()) {
        if (entity.hasComponent(Walking)) {
          entity.removeComponent(Walking);
          entity.addComponent(Idle);
        }
        return;
      }

      if (!entity.hasComponent(Walking)) {
        entity.addComponent(Walking);
        // entity.removeComponent(IsIdle);
      }

      const component = entity.getComponent(Walking);

      if (component.status === StateStatus.FINISHED) {
        entity.removeComponent(Walking);
        return;
      }

      if (component.status === StateStatus.NOT_STARTED) {
        this.onEnter(entity, component);
      }

      this.onUpdate(entity, component);

      return true;
    });
  }
}
