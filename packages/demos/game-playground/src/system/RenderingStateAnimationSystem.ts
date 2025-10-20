import { System, World, Query } from "@serbanghita-gamedev/ecs";
import { Direction, Directions, SpriteSheet, Animation } from "@serbanghita-gamedev/component";
import { AnimationRegistry } from "@serbanghita-gamedev/renderer";
import RenderingStateComponent from "../component/common/RenderingStateComponent";
import CurrentRenderingState from "../component/CurrentRenderingState";


export default class RenderingStateAnimationSystem extends System {

  public constructor(public world: World, public query: Query, protected animationRegistry: AnimationRegistry) {
    super(world, query);
  }

  public update() {
    const stateComponentsGroup = this.world.declarations.components.getComponentGroup('StateComponents');

    if (!stateComponentsGroup) {
      throw new Error('StateComponents group must be defined in order to provide animation.');
    }

    this.query.execute().forEach((entity) => {
      // Find the first "State" component and return it.
      const foundStateComponentDeclaration = stateComponentsGroup.components.find((component) => entity.hasComponent(component)) as typeof RenderingStateComponent | undefined;

      // Skip this Entity if it doesn't have a "State" component attached.
      if (!foundStateComponentDeclaration) {
        console.warn(`Entity ${entity.id} has no available state component.`);
        return;
      }

      const stateComponent = entity.getComponent(foundStateComponentDeclaration);

      const props = stateComponent.properties;
      const direction = entity.getComponent(Direction);

      /**
       * Animation
       */
      if (direction.x === Directions.LEFT) {
        props.animationStateName = `${props.stateName}_left`;
      } else if (direction.x === Directions.RIGHT) {
        props.animationStateName = `${props.stateName}_right`;
      }

      if (direction.y === Directions.UP) {
        props.animationStateName = `${props.stateName}_up`;
      } else if (direction.y === Directions.DOWN) {
        props.animationStateName = `${props.stateName}_down`;
      }

      // console.log(props.animationStateName);

      /**
       * Find the exact animation properties like length and duration.
       */
      const spriteSheet = entity.getComponent(SpriteSheet);
      const animationItem = this.animationRegistry.getAnimationsFor(spriteSheet.properties.spriteSheetAnimationsPath);
      if (!animationItem) {
        throw new Error(`Animations were not loaded for ${spriteSheet.properties.spriteSheetAnimationsPath}.`);
      }
      const animation = animationItem.animations.get(stateComponent.properties.animationStateName);
      if (!animation) {
        throw new Error(
          `Animation is not declared in ${spriteSheet.properties.spriteSheetAnimationsPath} for state ${stateComponent.properties.animationStateName}.`,
        );
      }

      // Register the current state.
      const currentRenderingStateComp = entity.getComponent(CurrentRenderingState);
      currentRenderingStateComp.setComponent(foundStateComponentDeclaration);

      // Register current Animation.
      stateComponent.properties.animation = animation;

      // milliseconds per frame
      const FRAME_DURATION = 60; // animation.frames[component.properties.animationTick];
      // Number of frames in the animation.
      const TOTAL_FRAMES = animation.frames.length;
      /**
       * Animation timing using delta time
       */
      const deltaTime = this.world.frameDuration;
      stateComponent.properties.animationTime += deltaTime;

      // Calculate current frame based on elapsed time
      const elapsedTime = stateComponent.properties.animationTime;
      const frameIndex = Math.floor(elapsedTime / FRAME_DURATION) % TOTAL_FRAMES;

      // Update animation tick (0-indexed frame number)
      stateComponent.properties.animationTick = frameIndex;

      // Reset animation time when the animation completes one cycle
      if (elapsedTime >= FRAME_DURATION * TOTAL_FRAMES) {
        stateComponent.properties.animationTime = 0;
        if (!stateComponent.properties.isContinuous) {
          // In our case we need to stop the animation + the action later in the System.
          stateComponent.properties.hasFinished = true;
          stateComponent.properties.isPlaying = false;
        }
      }
    });
  }
}