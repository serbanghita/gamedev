import Component from "../../ecs/src/Component";
import { loadLocalImage } from "@serbanghita-gamedev/assets";

export type Animation = {
  frames: AnimationFrame[];
  speed: number;
  hitboxOffset: { x: number; y: number };
};

export type AnimationFrame = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type SpriteSheetAnimation = {
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
};

export type SpriteSheetProps = {
  name: string;
  offset_x: number;
  offset_y: number;
  animations: Map<string, Animation>; // This is added and computed in PreRenderSystem.
  animationCurrentFrame: string;
  animationDefaultFrame: string;
  spriteSheetImgPath: string;
  spriteSheetAnimationsPath: string;
};

export type SpriteSheetPropsDeclaration = Pick<SpriteSheetProps, "name" | "offset_x" | "offset_y" | "spriteSheetImgPath" | "spriteSheetAnimationsPath">;

export default class SpriteSheet extends Component {
  constructor(public properties: SpriteSheetProps) {
    super(properties);

    // this.properties.img = loadLocalImage(
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires
    //     require(this.properties.spriteSheetImgPath)
    // );
    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // this.properties.animationsDeclaration = require(this.properties.spriteSheetAnimationsPath) as ISpriteSheetAnimation[];
  }
}
