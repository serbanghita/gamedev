import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { clearCtx, image, rectangle, AnimationRegistry, AnimationRegistryItem, text } from "@serbanghita-gamedev/renderer";
import { SpriteSheet, Position } from "@serbanghita-gamedev/component";
import Walking from "../component/Walking";
import Idle from "../component/Idle";
import AttackingWithClub from "../component/AttackingWithClub";

export default class RenderSystem extends System {
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
      const position = entity.getComponent(Position);
      const spriteSheet = entity.getComponent(SpriteSheet);
      const spriteSheetImg = this.animationRegistry.assets["entities/images"][spriteSheet.properties.spriteSheetImgPath];

      if (!spriteSheetImg) {
        throw new Error(`SpriteSheet image file ${spriteSheet.properties.spriteSheetImgPath} is missing.`);
      }

      let component;

      if (entity.hasComponent(AttackingWithClub)) {
        component = entity.getComponent(AttackingWithClub);
      } else if (entity.hasComponent(Walking)) {
        component = entity.getComponent(Walking);
      } else if (entity.hasComponent(Idle)) {
        component = entity.getComponent(Idle);
      } else {
        throw new Error(`Entity ${entity.id} has no default state to render.`);
      }

      const animationItem = this.animationRegistry.getAnimationsFor(spriteSheet.properties.spriteSheetAnimationsPath);
      if (!animationItem) {
        throw new Error(`Animations were not loaded for ${spriteSheet.properties.spriteSheetAnimationsPath}.`);
      }
      const animation = animationItem.animations.get(component.animationStateName);

      if (!animation) {
        throw new Error(
          `Animation is not declared in ${spriteSheet.properties.spriteSheetAnimationsPath} for state ${component.animationStateName}.`,
        );
      }

      if (component.animationTick >= animation.frames.length) {
        component.animationTick = 0;
      }

      const animationFrame = animation.frames[component.animationTick];
      const hitboxOffset = animation.hitboxOffset;

      const destPositionX = hitboxOffset?.x ? position.point.x - hitboxOffset.x : position.point.x;
      const destPositionY = hitboxOffset?.y ? position.point.y - hitboxOffset.y : position.point.y;

      if (!animationFrame) {
        throw new Error(`Cannot find animation frame ${component.animationTick} for "${component.animationStateName}".`);
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

      rectangle(this.ctx, destPositionX, destPositionY, animationFrame.width, animationFrame.height, "#cccccc");

      rectangle(this.ctx, destPositionX + hitboxOffset.x, destPositionY + hitboxOffset.y, 16, 16, "red");
    });

    // text(this.ctx, `entities: ${this.world.entities.size}`, 440, 400, "16", "serif", "", "black");
    // text(this.ctx, `fps: ${this.world.fps}`, 440, 420, "16", "serif", "", "black");
    // text(this.ctx, `frame duration: ${this.world.frameDuration.toFixed(4)}`, 440, 440, "16", "serif", "", "black");
    // text(this.ctx, `fps cap: ${this.world.fpsCap}`, 440, 460, "16", "serif", "", "black");
    // text(this.ctx, `frame no: ${this.world.frameNo}`, 440, 480, "16", "serif", "", "black");
  }
}
