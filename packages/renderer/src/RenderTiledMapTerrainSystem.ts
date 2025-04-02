import { System, Query, World } from "@serbanghita-gamedev/ecs";
import { TiledMapFile, TiledMap } from "@serbanghita-gamedev/tiled";
import { renderTile } from "@serbanghita-gamedev/renderer";
import { getPixelCoordinatesFromTile } from "@serbanghita-gamedev/grid";
import { rectangle } from "./canvas";

export default class RenderTiledMapTerrainSystem extends System {
  public constructor(
    public world: World,
    public query: Query,
    protected ctx: CanvasRenderingContext2D,
    protected terrainSprite: HTMLImageElement,
  ) {
    super(world, query);
  }

  private renderToBackgroundLayer(tiledMap: TiledMap) {
    if (!this.ctx) {
      throw new Error(`Background canvas ($background) was not created or passed.`);
    }

    // Create all the layers.
    tiledMap.getRenderLayers().forEach((layer) => {
      // Create all the items existing in the layer.
      for (let j = 0; j < layer.data.length; j++) {
        // Don't draw empty cells.
        if (layer.data[j] === 0) {
          continue;
        }

        renderTile(
          this.ctx, // @todo: Use buffer/off canvas.
          this.terrainSprite,
          tiledMap.getTileWidth(),
          tiledMap.getTileHeight(),
          j,
          layer.data[j],
          tiledMap.getWidthInTiles(),
          tiledMap.getHeightInTiles(),
        );
      }
    });

    tiledMap.getCollisionLayers().forEach((layer) => {
      for (let j = 0; j < layer.data.length; j++) {
        // Don't draw empty cells.
        if (layer.data[j] === 0) {
          continue;
        }

        const tileCoordinates = getPixelCoordinatesFromTile(j, { width: tiledMap.getWidthInTiles(), height: tiledMap.getHeightInTiles(), tileSize: tiledMap.getTileWidth() });

        rectangle(this.ctx, tileCoordinates.x, tileCoordinates.y, tiledMap.getTileWidth(), tiledMap.getTileHeight(), "rgb(125,0,0)", "rgba(255,0,0,0.1)");
        // j,
        //   layer.data[j],
      }
    });
  }

  public update(now: number): void {
    console.log("PreRenderTiledMapSystem.update");
    this.query.execute().forEach((entity) => {
      const tiledMapComponent = entity.getComponent(TiledMapFile);
      const tiledMapFileContents = tiledMapComponent.mapFileContents;
      const tiledMapFilePath = tiledMapComponent.mapFilePath;

      if (!tiledMapFileContents) {
        throw new Error(`Tiled map file JSON declaration ${tiledMapFilePath} was not found.`);
      }

      const tileMap = new TiledMap(tiledMapFileContents);
      this.renderToBackgroundLayer(tileMap);
    });

    // if (this.settings.ticksToRunBeforeExit === 1) {
    //   this.world.removeSystem(PreRenderTiledMapSystem);
    // }
  }
}
