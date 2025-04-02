import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Grid, GridTile} from "@serbanghita-gamedev/grid";
import TileToBeExplored from "../component/TileToBeExplored";
import RenderedInForeground from "../component/RenderedInForeground";
import {MinHeapWithNodes, MinHeapNode} from "@serbanghita-gamedev/pathfinding";
import {AStarPathFinding, AStarPathFindingSearchType} from "@serbanghita-gamedev/pathfinding";

const directions: [number, number][] = [
  [-1, 0], // left
  [1, 0], // right
  [0, -1], // top
  [0, 1] // bottom
];

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
      finishCoordinates: endGridCoordinates
    });

    this.aStar.setInsertQueueCallbackFn((node: MinHeapNode) => {
      const tileValue = node.value;
      const tileEntity = this.world.getEntity(`tile-${tileValue}`);
      if (tileEntity) {
        tileEntity.addComponent(TileToBeExplored);
        tileEntity.addComponent(RenderedInForeground);
      }
    });

  }

  public update(now: number): void {
      this.aStar.search();
  }
}
