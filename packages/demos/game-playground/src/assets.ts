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
import { SpriteSheetAnimation } from "@serbanghita-gamedev/component";
import { TiledMapFileContents } from "@serbanghita-gamedev/tiled";
import { Assets, EntityDeclaration } from "@serbanghita-gamedev/assets";

// @see https://esbuild.github.io/content-types/#data-url
// @see https://esbuild.github.io/content-types/#json

export async function loadAssets(): Promise<Assets> {
  return {
    "entities/images": {
      "./assets/sprites/kil.png": await loadLocalImage(require("./assets/sprites/kil.png")),
      "./assets/sprites/dino-boss.png": await loadLocalImage(require("./assets/sprites/dino-boss.png")),
      "./assets/sprites/dino-minion.png": await loadLocalImage(require("./assets/sprites/dino-minion.png")),
      "./assets/sprites/anky-boss.png": await loadLocalImage(require("./assets/sprites/anky-boss.png")),
      "./assets/sprites/anky-minion.png": await loadLocalImage(require("./assets/sprites/anky-minion.png")),
      "./assets/sprites/ptery-boss.png": await loadLocalImage(require("./assets/sprites/ptery-boss.png")),
      "./assets/sprites/ptery-minion.png": await loadLocalImage(require("./assets/sprites/ptery-minion.png")),
    },
    "entities/animations": {
      "./assets/sprites/kil.animations.json": require("./assets/sprites/kil.animations.json") as { [key: string]: SpriteSheetAnimation },
      "./assets/sprites/dino-boss.animations.json": require("./assets/sprites/dino-boss.animations.json") as { [key: string]: SpriteSheetAnimation },
      "./assets/sprites/dino-minion.animations.json": require("./assets/sprites/dino-minion.animations.json") as {
        [key: string]: SpriteSheetAnimation;
      },
      "./assets/sprites/anky-boss.animations.json": require("./assets/sprites/anky-boss.animations.json") as { [key: string]: SpriteSheetAnimation },
      "./assets/sprites/anky-minion.animations.json": require("./assets/sprites/anky-minion.animations.json") as {
        [key: string]: SpriteSheetAnimation;
      },
      "./assets/sprites/ptery-boss.animations.json": require("./assets/sprites/ptery-boss.animations.json") as { [key: string]: SpriteSheetAnimation },
      "./assets/sprites/ptery-minion.animations.json": require("./assets/sprites/ptery-minion.animations.json") as {
        [key: string]: SpriteSheetAnimation;
      },
    },
    "entities/declarations": require("./assets/entities.json") as EntityDeclaration[],
    "maps/images": {
      "./assets/sprites/terrain.png": await loadLocalImage(require("./assets/sprites/terrain.png")),
    },
    "maps/declarations": {
      "./assets/maps/E1MM2.json": require("./assets/maps/E1MM2.json") as TiledMapFileContents,
    },
  };
}
