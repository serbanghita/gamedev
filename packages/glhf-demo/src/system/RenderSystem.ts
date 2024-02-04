import Query from "../../../glhf-ecs/src/Query";
import System from "../../../glhf-ecs/src/System";
import {clearCtx, getCtx, renderImage} from "../../../glhf-renderer/src/canvas";
import Position from "../../../glhf-component/src/Position";
import Direction from "../../../glhf-component/src/Direction";
import SpriteSheet, { IAnimation } from "../../../glhf-component/src/SpriteSheet";
import State from "../../../glhf-component/src/State";
import IsWalking from "../component/IsWalking";
import IsIdle from "../component/IsIdle";

export default class RenderSystem extends System {

    public constructor(public query: Query, protected $foreground: HTMLCanvasElement) {
        super();
    }

    public update(now: number): void {
        this.query.execute().forEach(entity => {
            clearCtx(getCtx(this.$foreground), 0, 0, 640, 480);

            const position = entity.getComponent(Position);
            const spriteSheet = entity.getComponent(SpriteSheet);

            let state;
            if (entity.hasComponent(IsWalking)) {
                state = entity.getComponent(IsWalking);
            } else if (entity.hasComponent(IsIdle)) {
                state = entity.getComponent(IsIdle);
            } else {
                throw new Error(`Entity ${entity.id} has no default state to render.`);
            }


            const animation = spriteSheet.properties.animations.get(state.properties.animationState) as IAnimation;
            if (state.properties.animationTick >= animation.frames.length) {
                state.properties.animationTick = 0;
            }

            const animationFrame = animation.frames[state.properties.animationTick];

            if (!animationFrame) {
                throw new Error(`Cannot find animation frame ${state.properties.animationTick} for "${state.properties.animationState}".`);
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
                position.properties.x,
                position.properties.y,
                animationFrame.width,
                animationFrame.height
            );
        });
    }

}