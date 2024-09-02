/* eslint-disable @typescript-eslint/no-var-requires */
import { loadLocalImage } from "@serbanghita-gamedev/assets";

export async function loadSprites() {
   const SPRITES: { [key: string]: HTMLImageElement } = {
    "./assets/sprites/terrain.png": await loadLocalImage(require("./assets/sprites/terrain.png"))
  }

  return SPRITES;
}