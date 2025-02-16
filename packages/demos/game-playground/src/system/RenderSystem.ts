import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { clearCtx, image, rectangle, AnimationRegistry, AnimationRegistryItem } from "@serbanghita-gamedev/renderer";
import { SpriteSheet, Position } from "@serbanghita-gamedev/component";
import IsWalking from "../component/IsWalking";
import IsIdle from "../component/IsIdle";
import IsAttackingWithClub from "../component/IsAttackingWithClub";

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

      if (entity.hasComponent(IsAttackingWithClub)) {
        component = entity.getComponent(IsAttackingWithClub);
      } else if (entity.hasComponent(IsWalking)) {
        component = entity.getComponent(IsWalking);
      } else if (entity.hasComponent(IsIdle)) {
        component = entity.getComponent(IsIdle);
      } else {
        throw new Error(`Entity ${entity.id} has no default state to render.`);
      }

      const animationItem = this.animationRegistry.getAnimationsFor(spriteSheet.properties.spriteSheetAnimationsPath);
      if (!animationItem) {
        throw new Error(`Animations were not loaded for ${spriteSheet.properties.spriteSheetAnimationsPath}.`);
      }
      const animation = animationItem.animations.get(component.properties.animationStateName);

      if (!animation) {
        throw new Error(
          `Animation is not declared in ${spriteSheet.properties.spriteSheetAnimationsPath} for state ${component.properties.animationStateName}.`,
        );
      }

      if (component.properties.animationTick >= animation.frames.length) {
        component.properties.animationTick = 0;
      }

      const animationFrame = animation.frames[component.properties.animationTick];
      const hitboxOffset = animation.hitboxOffset;

      const destPositionX = hitboxOffset?.x ? position.point.x - hitboxOffset.x : position.point.x;
      const destPositionY = hitboxOffset?.y ? position.point.y - hitboxOffset.y : position.point.y;

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

      rectangle(this.ctx, destPositionX, destPositionY, animationFrame.width, animationFrame.height, "#cccccc");

      rectangle(this.ctx, destPositionX + hitboxOffset.x, destPositionY + hitboxOffset.y, 16, 16, "red");
    });
  }
}
