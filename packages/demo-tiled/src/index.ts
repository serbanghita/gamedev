// 0. Create the UI and canvas.
import {createWrapperElement, createCanvas} from "@serbanghita-gamedev/renderer";
import {World} from "@serbanghita-gamedev/ecs";
import { PreRenderTiledMapSystem } from "@serbanghita-gamedev/renderer";
import IsTiledMap from "@serbanghita-gamedev/component/IsTiledMap";
import { loadSprites } from "./assets";

async function runGame() {
  const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
  const CANVAS_FOREGROUND = createCanvas("foreground", 640, 480, "1");
  const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "2");
  HTML_WRAPPER.appendChild(CANVAS_FOREGROUND);
  HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
  document.body.appendChild(HTML_WRAPPER);

  const SPRITES = await loadSprites();

  // Create the current "World" (scene).
  const world = new World();

  world.declarations.components.registerComponent(IsTiledMap);

  const CustomMapEntity = world.createEntity("map");
  CustomMapEntity.addComponent(IsTiledMap, {mapFile: require("./assets/maps/E1MM2.json")})

  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [IsTiledMap] });
  world.createSystem(PreRenderTiledMapSystem, TiledMapQuery, CANVAS_BACKGROUND, SPRITES).runOnlyOnce();
  world.systems.forEach((system) => system.update(0));
}

runGame().then(() => console.log('Game started ...'));