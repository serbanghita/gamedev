/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This file statically defines all the assets needed for the game to run:
 *  - entities & components declarations
 *  - sprites
 *  - sprites animations
 *  - sprites animations pre-processed.
 *
 *  Ideally these could be read from /assets/ folder dynamically, but JS + esbuild doesn't support that yet.
 *  I could write a plugin for esbuild to prepare all files of types PNG and JSON to be statically included prior to bundling.
 */

// Added manually because esbuild doesn't support dynamic imports
import { loadLocalImage } from "@serbanghita-gamedev/assets";
import { Animation, SpriteSheetAnimation } from "@serbanghita-gamedev/component";
import { TiledMapFile } from "@serbanghita-gamedev/tiled";

// @see https://esbuild.github.io/content-types/#data-url
export async function loadSprites() {
  const SPRITES: { [key: string]: HTMLImageElement } = {
    "./assets/sprites/kil.png": await loadLocalImage(require("./assets/sprites/kil.png")),
    "./assets/sprites/dino-boss.png": await loadLocalImage(require("./assets/sprites/dino-boss.png")),
    "./assets/sprites/dino-minion.png": await loadLocalImage(require("./assets/sprites/dino-minion.png")),
    "./assets/sprites/anky-boss.png": await loadLocalImage(require("./assets/sprites/anky-boss.png")),
    "./assets/sprites/anky-minion.png": await loadLocalImage(require("./assets/sprites/anky-minion.png")),
    "./assets/sprites/ptery-boss.png": await loadLocalImage(require("./assets/sprites/ptery-boss.png")),
    "./assets/sprites/ptery-minion.png": await loadLocalImage(require("./assets/sprites/ptery-minion.png")),
    "./assets/sprites/terrain.png": await loadLocalImage(require("./assets/sprites/terrain.png")),
  };

  return SPRITES;
}

export const MAPS: { [key: string]: TiledMapFile } = {
  "./assets/maps/E1MM2.json": require("./assets/maps/E1MM2.json"),
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
