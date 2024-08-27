import { Entity, System } from "@serbanghita-gamedev/ecs";
import { Animation, SpriteSheet } from "@serbanghita-gamedev/component";
import { ANIMATIONS_DECLARATIONS, ANIMATIONS_REGISTRY } from "../assets";

export default class PreRenderSystem extends System {
  private setAnimationFramesForSpriteSheet(entity: Entity) {
    const spriteSheet = entity.getComponent(SpriteSheet);
    const spriteSheetAnimations = ANIMATIONS_DECLARATIONS[spriteSheet.properties.spriteSheetAnimationsPath];

    if (!spriteSheetAnimations) {
      throw new Error(`Animations JSON file ${spriteSheet.properties.spriteSheetAnimationsPath} is missing.`);
    }

    let offsetY: number = 0;
    let previousAnimationHeight = 0;
    const animations: Map<string, Animation> = new Map();

    let animationIndex = 0;
    let animationDefaultFrame = "";
    for (const [animationName, animation] of Object.entries(spriteSheetAnimations)) {
      // Set the default animation.
      if (animation.defaultAnimation) {
        animationDefaultFrame = animationName;
      }

      if (animationIndex > 0 && !animation.parent) {
        // Increment with the previous frame's height.
        offsetY += previousAnimationHeight;
      }

      const frames = animation.frames.map((frameIndex: number) => {
        return {
          width: animation.width,
          height: animation.height,
          x: spriteSheet.properties.offset_x + frameIndex * animation.width,
          y: spriteSheet.properties.offset_y + offsetY,
        };
      });

      animations.set(animationName, {
        frames,
        speed: animation.speedTicks,
        hitboxOffset: animation.hitboxOffset,
      });

      // Last step.
      previousAnimationHeight = animation.height;
      animationIndex++;
    }

    ANIMATIONS_REGISTRY[spriteSheet.properties.spriteSheetAnimationsPath] = { animationDefaultFrame, animations };
  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      this.setAnimationFramesForSpriteSheet(entity);
    });
  }
}
