import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { clearCtx, getCtx, image, rectangle } from "@serbanghita-gamedev/renderer";
import { Position, SpriteSheet } from "@serbanghita-gamedev/component";
import IsWalking from "../component/IsWalking";
import IsIdle from "../component/IsIdle";
import IsAttackingWithClub from "../component/IsAttackingWithClub";
import { ANIMATIONS_REGISTRY } from "../assets";

export default class RenderSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    protected CANVAS: HTMLCanvasElement,
    protected SPRITES: { [key: string]: HTMLImageElement },
  ) {
    super(world, query);
  }

  public update(now: number): void {
    clearCtx(getCtx(this.CANVAS), 0, 0, 640, 480);

    this.query.execute().forEach((entity) => {
      const position = entity.getComponent(Position);
      const spriteSheet = entity.getComponent(SpriteSheet);
      const spriteSheetImg = this.SPRITES[spriteSheet.properties.spriteSheetImgPath];

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

      const animation = ANIMATIONS_REGISTRY[spriteSheet.properties.spriteSheetAnimationsPath].animations.get(
        component.properties.animationStateName,
      );

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

      const destPositionX = hitboxOffset?.x ? position.properties.x - hitboxOffset.x : position.properties.x;
      const destPositionY = hitboxOffset?.y ? position.properties.y - hitboxOffset.y : position.properties.y;

      if (!animationFrame) {
        throw new Error(
          `Cannot find animation frame ${component.properties.animationTick} for "${component.properties.animationStateName}".`,
        );
      }

      image(
        getCtx(this.CANVAS),
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

      rectangle(
        getCtx(this.CANVAS) as CanvasRenderingContext2D,
        destPositionX,
        destPositionY,
        animationFrame.width,
        animationFrame.height,
        "#cccccc",
      );

      rectangle(
        getCtx(this.CANVAS) as CanvasRenderingContext2D,
        destPositionX + hitboxOffset.x,
        destPositionY + hitboxOffset.y,
        16,
        16,
        "red",
      );
    });
  }
}
