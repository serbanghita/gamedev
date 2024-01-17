import Component from "../../glhf-ecs/src/Component";

interface ISpriteSheetProperties {
    name: string;
    offset_x: number;
    offset_y: number;
    img: HTMLImageElement;
    frames: ISpriteSheetAnimationsFrame[];
    animationCurrentFrame: string;
    animationDefaultFrame: string;
}

export interface ISpriteSheetAnimationsFrame {
    name: string;
    defaultAnimation?: boolean;
    parent?: string; // An animation based on a previous animation (doesn't count as offset on Y).
    width: number;
    height: number;
    frames: number[];
    speedTicks: number;
    hitboxOffset?: {
        x: number;
        y: number;
    };
}

export default class SpriteSheet extends Component {
    constructor(public properties: ISpriteSheetProperties) {
        super(properties);
    }
}