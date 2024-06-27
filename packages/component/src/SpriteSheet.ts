import Component from "../../ecs/src/Component";
import {loadLocalImage} from "@serbanghita-gamedev/assets";

export interface IAnimation {
    frames: IAnimationFrame[];
    speed: number;
    hitboxOffset: {x: number, y: number};
}

export interface IAnimationFrame {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface ISpriteSheetAnimation {
    name: string;
    defaultAnimation?: boolean;
    parent?: string; // An animation based on a previous animation (doesn't count as offset on Y).
    width: number;
    height: number;
    frames: number[];
    speedTicks: number;
    hitboxOffset: {
        x: number;
        y: number;
    };
}

export interface ISpriteSheetProperties {
    name: string;
    offset_x: number;
    offset_y: number;
    img: HTMLImageElement;
    animationsDeclaration: ISpriteSheetAnimation[];
    animations: Map<string, IAnimation>;
    animationCurrentFrame: string;
    animationDefaultFrame: string;
    spriteSheetImgPath: string;
    spriteSheetAnimationsPath: string;
}

export default class SpriteSheet extends Component {
    constructor(public properties: ISpriteSheetProperties) {
        super(properties);

        // this.properties.img = loadLocalImage(
        //     // eslint-disable-next-line @typescript-eslint/no-var-requires
        //     require(this.properties.spriteSheetImgPath)
        // );
        // // eslint-disable-next-line @typescript-eslint/no-var-requires
        // this.properties.animationsDeclaration = require(this.properties.spriteSheetAnimationsPath) as ISpriteSheetAnimation[];
    }
}