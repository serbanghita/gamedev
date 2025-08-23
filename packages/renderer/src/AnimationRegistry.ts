import { Animation, SpriteSheet } from "@serbanghita-gamedev/component";
import { Assets, EntityDeclaration } from "@serbanghita-gamedev/assets";

export type AnimationRegistryItem = {
  animationDefaultFrame: string;
  animations: Map<string, Animation>;
};

export function loadAnimationRegistry(assets: Assets): AnimationRegistry {
  const instance = new AnimationRegistry(assets);
  instance.load();

  return instance;
}

export default class AnimationRegistry {
  // Store pre-computed animation frames from the sprite sheet asset.
  private animations: Map<string, AnimationRegistryItem> = new Map();

  public constructor(public assets: Assets) {}

  public load() {
    for (let entityName in this.assets["entities/declarations"]) {
      const entityDeclaration = this.assets["entities/declarations"][entityName];
      this.setAnimationFramesForSpriteSheet(entityDeclaration)
    }
  }

  public getAnimationsFor(spriteSheetAnimationsPath: string)
  {
    return this.animations.get(spriteSheetAnimationsPath);
  }

  public setAnimationFramesForSpriteSheet(entityDeclaration: EntityDeclaration) {
    const spriteSheet = entityDeclaration.components.SpriteSheet;
    const spriteSheetAnimations = this.assets["entities/animations"][spriteSheet.spriteSheetAnimationsPath];

    if (!spriteSheetAnimations) {
      throw new Error(`Animations JSON file ${spriteSheet.spriteSheetAnimationsPath} is missing.`);
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
          x: spriteSheet.offset_x + frameIndex * animation.width,
          y: spriteSheet.offset_y + offsetY,
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

    this.animations.set(spriteSheet.spriteSheetAnimationsPath, { animationDefaultFrame, animations });
  }
}
