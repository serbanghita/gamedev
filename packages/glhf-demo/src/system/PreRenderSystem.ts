import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import Entity from "../../../glhf-ecs/src/Entity";
import SpriteSheet, {IAnimation, IAnimationFrame} from "../../../glhf-component/src/SpriteSheet";

export default class PreRenderSystem extends System {
    public constructor(protected query: Query) {
        super();
    }

    private setAnimationFramesForSpriteSheet(entity: Entity)
    {
        const spriteSheet = entity.getComponent(SpriteSheet);

        let offsetY: number = 0;
        const animations: Map<string, IAnimation> = new Map();

        spriteSheet.properties.animationsDeclaration.forEach((animation, animationIndex) => {
            // Set the default animation.
            if (animation.defaultAnimation) {
                spriteSheet.properties.animationDefaultFrame = animation.name;
            }

            if (animationIndex > 0 && !animation.parent) {
                // Increment with the previous frame's height.
                offsetY += spriteSheet.properties.animationsDeclaration[animationIndex - 1].height;
            }

            const frames = animation.frames.map((frameIndex: number) => {
                return {
                    width: animation.width,
                    height: animation.height,
                    x: spriteSheet.properties.offset_x + (frameIndex * animation.width),
                    y: spriteSheet.properties.offset_y + offsetY
                };
            });

            animations.set(animation.name, {
                frames,
                speed: animation.speedTicks,
                hitboxOffset: animation.hitboxOffset
            });
        });

        spriteSheet.properties.animations = animations;
    }

    public update(now: number): void {
        this.query.execute().forEach(entity => {
            this.setAnimationFramesForSpriteSheet(entity);
        });
    }
}