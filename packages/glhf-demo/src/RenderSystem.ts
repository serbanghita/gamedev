import Query from "../../glhf-ecs/src/Query";
import System from "../../glhf-ecs/src/System";
import {clearCtx, getCtx, renderImage} from "../../glhf-renderer/src/canvas";
import Position from "../../glhf-component/src/Position";
import Direction, { Directions } from "../../glhf-component/src/Direction";
import SpriteSheet, { IAnimation } from "../../glhf-component/src/SpriteSheet";
import State from "../../glhf-component/src/State";

export default class RenderSystem extends System {

    public constructor(protected query: Query, protected $foreground: HTMLCanvasElement) {
        super();
    }

    private getDestinationSpriteData()
    {

    }


    public update(now: number): void {
        this.query.execute().forEach(entity => {
            clearCtx(getCtx(this.$foreground), 0, 0, 640, 480);

            const position = entity.getComponent(Position);
            const direction = entity.getComponent(Direction);
            const spriteSheet = entity.getComponent(SpriteSheet);

            // Check the Entity 'state' - in our case the direction atm.
            // 'state' can be 'Walking' while SpriteSheet 'state' could be 'Walking_Left'.

            // Find the SpriteSheetAnimation by name
            // Render dX, dY, dWidth, dHeight (offset?)

            const state = entity.getComponent(State);

            const animation = spriteSheet.properties.animations.get(state.properties.animationFrameName) as IAnimation;
            if (state.properties.animationFrameTick === animation.frames.length) {
                state.properties.animationFrameTick = 0;
            }

            const animationFrame = animation.frames[state.properties.animationFrameTick];

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