import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Grid} from "@serbanghita-gamedev/grid";
import TileToBeExplored from "../component/TileToBeExplored";
import RenderedInForeground from "../component/RenderedInForeground";
import {MinHeapNode} from "@serbanghita-gamedev/pathfinding";
import {AStarPathFinding, AStarPathFindingSearchType} from "@serbanghita-gamedev/pathfinding";
import TileIsInThePathFound from "../component/TileIsInThePathFound";

export default class AStarPathFindingSystem extends System {
  private aStar: AStarPathFinding;

  public constructor(
    public world: World,
    public query: Query,
    public map: Entity,
    public startGridCoordinates: {x: number, y: number},
    public endGridCoordinates: { x: number, y: number }
  ) {
    super(world, query);

    const gridComp = this.map.getComponent(Grid);

    this.aStar = new AStarPathFinding({
      matrix1D: gridComp.matrix,
      matrixWidth: gridComp.width,
      matrixHeight: gridComp.height,
      matrixTileSize: gridComp.tileSize,
      searchType: AStarPathFindingSearchType.BY_STEP,
      startCoordinates: startGridCoordinates,
      finishCoordinates: endGridCoordinates,
      onInsertQueue: ((node: MinHeapNode) => {
        const tileValue = node.value;
        const tileEntity = this.world.getEntity(`tile-${tileValue}`);
        if (tileEntity) {
          tileEntity.addComponent(TileToBeExplored);
          tileEntity.addComponent(RenderedInForeground);
        }
      }),
      onSuccess: (() => {
        console.log(this.aStar.path);
        this.aStar.path.forEach((tileValue) => {
          const tileEntity = this.world.getEntity(`tile-${tileValue}`);
          if (tileEntity) {
            tileEntity.addComponent(TileIsInThePathFound);
            tileEntity.addComponent(RenderedInForeground);
          }
        });
      }),

    });

  }

  public update(): void {
      this.aStar.search();
  }
}
