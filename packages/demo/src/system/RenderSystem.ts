import {System, Query, World} from "@serbanghita-gamedev/ecs";
import {clearCtx, getCtx, renderImage, renderRectangle} from "@serbanghita-gamedev/renderer";
import {Position, SpriteSheet, IAnimation } from "@serbanghita-gamedev/component";
import IsWalking from "../component/IsWalking";
import IsIdle from "../component/IsIdle";
import IsAttackingWithClub from "../component/IsAttackingWithClub";

export default class RenderSystem extends System {

    public constructor(public world: World, public query: Query, protected $foreground: HTMLCanvasElement) {
        super(world, query);
    }

    public update(now: number): void {
        clearCtx(getCtx(this.$foreground), 0, 0, 640, 480);
        
        this.query.execute().forEach(entity => {
            const position = entity.getComponent(Position);
            const spriteSheet = entity.getComponent(SpriteSheet);

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


            const animation = spriteSheet.properties.animations.get(component.properties.animationStateName) as IAnimation;
            if (component.properties.animationTick >= animation.frames.length) {
                component.properties.animationTick = 0;
            }

            const animationFrame = animation.frames[component.properties.animationTick];
            const hitboxOffset = animation.hitboxOffset;

            const destPositionX = hitboxOffset?.x ? position.properties.x - hitboxOffset.x : position.properties.x;
            const destPositionY = hitboxOffset?.y ? position.properties.y - hitboxOffset.y : position.properties.y;

            if (!animationFrame) {
                throw new Error(`Cannot find animation frame ${component.properties.animationTick} for "${component.properties.animationStateName}".`);
            }

            renderImage(
                getCtx(this.$foreground),
                spriteSheet.properties.img,
                // source
                animationFrame.x,
                animationFrame.y,
                animationFrame.width,
                animationFrame.height,
                // dest
                destPositionX,
                destPositionY,
                animationFrame.width,
                animationFrame.height
            );


            renderRectangle(
                getCtx(this.$foreground) as CanvasRenderingContext2D,
                destPositionX, destPositionY,
                animationFrame.width,  animationFrame.height,
                '#cccccc'
            );

            renderRectangle(
                getCtx(this.$foreground) as CanvasRenderingContext2D,
                destPositionX + hitboxOffset.x, destPositionY + hitboxOffset.y,
                16, 16,
                'red'
            );
        });
    }

}