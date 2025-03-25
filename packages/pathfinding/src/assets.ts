/* eslint-disable @typescript-eslint/no-var-requires */
import { loadLocalImage } from "@serbanghita-gamedev/assets";

export async function loadSprites() {
   const SPRITES: { [key: string]: HTMLImageElement } = {
    "./assets/terrain_sprite.png": await loadLocalImage(require("./assets/terrain_sprite.png"))
  }

  return SPRITES;
}
