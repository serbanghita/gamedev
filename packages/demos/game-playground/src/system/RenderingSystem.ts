import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { clearCtx, image, rectangle, AnimationRegistry, AnimationRegistryItem, text } from "@serbanghita-gamedev/renderer";
import { SpriteSheet, PositionOnScreen } from "@serbanghita-gamedev/component";
import CurrentRenderingState from "../component/CurrentRenderingState";

export default class RenderingSystem extends System {
  public constructor(
    public world: World,
    public query: Query,

    protected animationRegistry: AnimationRegistry,
    protected ctx: CanvasRenderingContext2D,
  ) {
    super(world, query);
  }

  public update(now: number): void {
    clearCtx(this.ctx, 0, 0, 640, 480);

    this.query.execute().forEach((entity) => {
      // Get the position and spritesheet.
      const position = entity.getComponent(PositionOnScreen);
      const spriteSheet = entity.getComponent(SpriteSheet);
      const spriteSheetImg = this.animationRegistry.assets["entities/images"][spriteSheet.properties.spriteSheetImgPath];

      if (!spriteSheetImg) {
        throw new Error(`SpriteSheet image file ${spriteSheet.properties.spriteSheetImgPath} is missing.`);
      }

      const currentRenderingStateComp = entity.getComponent(CurrentRenderingState);
      const componentDeclaration = currentRenderingStateComp.properties.component;

      const component = entity.getComponent(componentDeclaration);
      const animation = component.properties.animation;


      if (!component || !animation) {
        throw new Error(`CurrentAnimationState has no component or animation`);
      }

      // Draw the animation sprite.
      const animationFrame = animation.frames[component.properties.animationTick];
      const hitboxOffset = animation.hitboxOffset;

      const destPositionX = hitboxOffset?.x ? Math.round(position.x) - hitboxOffset.x : Math.round(position.x);
      const destPositionY = hitboxOffset?.y ? Math.round(position.y) - hitboxOffset.y : Math.round(position.y);

      if (!animationFrame) {
        throw new Error(`Cannot find animation frame ${component.properties.animationTick} for "${component.properties.animationStateName}".`);
      }

      image(
        this.ctx,
        spriteSheetImg,
        // source
        animationFrame.x,
        animationFrame.y,
        animationFrame.width,
        animationFrame.height,
        // dest
        destPositionX,
        destPositionY,
        animationFrame.width,
        animationFrame.height,
      );

      // rectangle(this.ctx, destPositionX, destPositionY, animationFrame.width, animationFrame.height, "#cccccc");
      //
      // rectangle(this.ctx, destPositionX + hitboxOffset.x, destPositionY + hitboxOffset.y, 16, 16, "red");
    });

    // text(this.ctx, `entities: ${this.world.entities.size}`, 440, 400, "16", "serif", "", "black");
    // text(this.ctx, `fps: ${this.world.fps}`, 440, 420, "16", "serif", "", "black");
    // text(this.ctx, `frame duration: ${this.world.frameDuration.toFixed(4)}`, 440, 440, "16", "serif", "", "black");
    // text(this.ctx, `fps cap: ${this.world.fpsCap}`, 440, 460, "16", "serif", "", "black");
    // text(this.ctx, `frame no: ${this.world.frameNo}`, 440, 480, "16", "serif", "", "black");
  }
}
