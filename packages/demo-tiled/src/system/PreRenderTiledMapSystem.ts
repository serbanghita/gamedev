import { System, Query, World } from "@serbanghita-gamedev/ecs";
import IsTiledMap from "../component/IsTiledMap";
import { renderTile } from "@serbanghita-gamedev/renderer";
import TiledMap from "@serbanghita-gamedev/tiled/tiled";
import { getCtx } from "@serbanghita-gamedev/renderer";

export class PreRenderTiledMapSystem extends System
{
  public constructor(public world: World, public query: Query, protected CANVAS_BACKGROUND: HTMLCanvasElement, protected SPRITES: { [key: string]: HTMLImageElement }) {
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
          // getBufferCtx(getObjectProperty(layer.properties, "renderOnLayer")),
          getCtx(this.CANVAS_BACKGROUND),
          this.SPRITES["./assets/sprites/terrain.png"],
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
      console.log(entity);

      const tiledMapComponent = entity.getComponent(IsTiledMap);
      const tiledMapFile = tiledMapComponent.properties.mapFile;

      const tileMap = new TiledMap(tiledMapFile);
      this.renderToBuffer(tileMap);


    });
  }
}