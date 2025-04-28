import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import {Grid} from "@serbanghita-gamedev/grid";
import TileToBeExplored from "../component/TileToBeExplored";
import RenderedInForeground from "../component/RenderedInForeground";
import {MinHeapNode} from "@serbanghita-gamedev/pathfinding";
import {AStarPathFinding, AStarPathFindingSearchType} from "@serbanghita-gamedev/pathfinding";

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

    this.aStar.setFoundCallbackFn((node: MinHeapNode) => {
      let current: number = node.value;
      const path: number[] = [current];

      while(this.aStar.cameFromTiles.has(current)) {
        const cameFrom: number = this.aStar.cameFromTiles.get(current) as number;
        path.push(cameFrom);
        current = cameFrom
      }

      console.log(path);
    });

  }

  public update(): void {
      this.aStar.search();
  }
}
