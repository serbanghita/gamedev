import { System, Query, World } from "@serbanghita-gamedev/ecs";
import IsTiledMap from "../../component/src/IsTiledMap";
import { renderTile } from "@serbanghita-gamedev/renderer";
import { TiledMap, TiledMapFile } from "@serbanghita-gamedev/tiled";
import { getCtx } from "@serbanghita-gamedev/renderer";

export default class PreRenderTiledMapSystem extends System
{
  public constructor(
    public world: World,
    public query: Query,
    protected CANVAS_BACKGROUND: HTMLCanvasElement,
    protected TERRAIN_SPRITE: HTMLImageElement,
    protected MAPS: { [key: string]: TiledMapFile }
  ) {
    super(world, query);
  }

  private renderToBuffer(tiledMap: TiledMap) {

    if (!this.CANVAS_BACKGROUND) {
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
          // @ts-expect-error Not sure why TS sees this as potentially null.
          getCtx(this.CANVAS_BACKGROUND), // @todo: Use buffer/off canvas.
          this.TERRAIN_SPRITE,
          tiledMap.getTileWidth(),
          tiledMap.getTileHeight(),
          j,
          layer.data[j],
          tiledMap.getWidthInTiles(),
          tiledMap.getHeightInTiles()
        );
      }

    });

  }

  public update(now: number): void {
    this.query.execute().forEach((entity) => {
      const tiledMapComponent = entity.getComponent(IsTiledMap);
      const tiledMapFilePath = tiledMapComponent.properties.mapFilePath;
      const tiledMapFile = this.MAPS[tiledMapFilePath];

      if (!tiledMapFile) {
        throw new Error(`Tiled map file JSON declaration ${tiledMapFilePath} was not found.`)
      }

      const tileMap = new TiledMap(tiledMapFile);
      this.renderToBuffer(tileMap);
    });
  }
}