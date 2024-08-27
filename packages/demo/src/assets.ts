/* eslint-disable @typescript-eslint/no-var-requires */
// Added manually because esbuild doesn't support dynamic imports
import { loadLocalImage } from "@serbanghita-gamedev/assets";
import { Animation, SpriteSheetAnimation } from "@serbanghita-gamedev/component";

// @see https://esbuild.github.io/content-types/#data-url
export const SPRITES: { [key: string]: HTMLImageElement } = {
  "./assets/sprites/kil.png": loadLocalImage(require("./assets/sprites/kil.png")),
  "./assets/sprites/dino-boss.png": loadLocalImage(require("./assets/sprites/dino-boss.png")),
  "./assets/sprites/dino-minion.png": loadLocalImage(require("./assets/sprites/dino-minion.png")),
  "./assets/sprites/anky-boss.png": loadLocalImage(require("./assets/sprites/anky-boss.png")),
  "./assets/sprites/anky-minion.png": loadLocalImage(require("./assets/sprites/anky-minion.png")),
  "./assets/sprites/ptery-boss.png": loadLocalImage(require("./assets/sprites/ptery-boss.png")),
  "./assets/sprites/ptery-minion.png": loadLocalImage(require("./assets/sprites/ptery-minion.png")),
};

// @see https://esbuild.github.io/content-types/#json
export const ANIMATIONS_DECLARATIONS: { [animationDeclarationPath: string]: SpriteSheetAnimation[] } = {
  "./assets/sprites/kil.animations.json": require("./assets/sprites/kil.animations.json"),
  "./assets/sprites/dino-boss.animations.json": require("./assets/sprites/dino-boss.animations.json"),
  "./assets/sprites/dino-minion.animations.json": require("./assets/sprites/dino-minion.animations.json"),
  "./assets/sprites/anky-boss.animations.json": require("./assets/sprites/anky-boss.animations.json"),
  "./assets/sprites/anky-minion.animations.json": require("./assets/sprites/anky-minion.animations.json"),
  "./assets/sprites/ptery-boss.animations.json": require("./assets/sprites/ptery-boss.animations.json"),
  "./assets/sprites/ptery-minion.animations.json": require("./assets/sprites/ptery-minion.animations.json"),
};

export type AnimationsRegistry = {
  [animationDeclarationPath: string]: {
    animationDefaultFrame: string;
    animations: Map<string, Animation>;
  };
};

export const ANIMATIONS_REGISTRY: AnimationsRegistry = {};

export interface EntityDeclaration {
  id: string;
  components: { [componentName: string]: object };
}

export const ENTITIES_DECLARATIONS = require("./assets/entities.json") as EntityDeclaration[];
