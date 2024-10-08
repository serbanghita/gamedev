// 0. Create the UI and canvas.
import { createWrapperElement, createCanvas, run, image, dot } from "@serbanghita-gamedev/renderer";
import { World } from "@serbanghita-gamedev/ecs";
import { PreRenderTiledMapSystem } from "@serbanghita-gamedev/renderer";
import { IsTiledMap } from "@serbanghita-gamedev/component";
import { loadSprites } from "./assets";
import { Point } from "@serbanghita-gamedev/geometry";

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function setup() {
  const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
  const CANVAS_FOREGROUND = createCanvas("foreground", 640, 480, "2");
  const CTX_FOREGROUND = CANVAS_FOREGROUND.getContext("2d") as CanvasRenderingContext2D;
  const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
  HTML_WRAPPER.appendChild(CANVAS_FOREGROUND);
  HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
  document.body.appendChild(HTML_WRAPPER);

  const SPRITES = await loadSprites();

  // Create the current "World" (scene).
  const world = new World();

  world.declarations.components.registerComponent(IsTiledMap);

  const CustomMapEntity = world.createEntity("map");
  CustomMapEntity.addComponent(IsTiledMap, { mapFile: require("./assets/maps/E1MM2.json"), mapFilePath: "./assets/maps/E1MM2.json" });

  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [IsTiledMap] });
  world.createSystem(PreRenderTiledMapSystem, TiledMapQuery, CANVAS_BACKGROUND, SPRITES["./assets/sprites/terrain.png"]).runOnlyOnce();
  world.systems.forEach((system) => system.update(0));

  const point = new Point(640 / 2, 480 / 2);

  run(() => {
    CTX_FOREGROUND.clearRect(0, 0, 640, 480);
    // image(CTX_FOREGROUND, CANVAS_BACKGROUND, 0, 0, 640, 480, 0, 0, 640, 480);

    point.x += randomInt(-2, 2);
    point.y += randomInt(-2, 2);
    dot(CTX_FOREGROUND, point.x, point.y, "rgb(255,0,0)", 10);
  });
}

setup().then(() => console.log("Game started ..."));
