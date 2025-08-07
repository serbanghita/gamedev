import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { Grid, PositionOnGrid } from "@serbanghita-gamedev/grid";
import { AStarPathFinding, AStarPathFindingSearchType, AStarPathFindingResultType, MinHeapNode, EuclideanDistance } from "@serbanghita-gamedev/pathfinding";
import TileIsInThePathFound from "../component/TileIsInThePathFound";
import TileToBeExplored from "../component/TileToBeExplored";
import DebugRenderedInForeground from "../component/DebugRenderedInForeground";

export default class AStarPathFindingSystem extends System {
  private aStar: AStarPathFinding;

  public constructor(
    public world: World,
    public query: Query,
    public map: Entity
  ) {
    super(world, query);

    const gridComp = this.map.getComponent(Grid);
    const dinoBoss = this.world.getEntity('dino-boss') as Entity;
    const player = this.world.getEntity('player') as Entity;

    const startGridCoordinates: { x: number; y: number } = dinoBoss.getComponent(PositionOnGrid);
    const endGridCoordinates: { x: number; y: number } = player.getComponent(PositionOnGrid);

    this.aStar = new AStarPathFinding({
      matrix1D: gridComp.matrix,
      matrixWidth: gridComp.width,
      matrixHeight: gridComp.height,
      searchType: AStarPathFindingSearchType.BY_STEP,
      resultType: AStarPathFindingResultType.FULL_PATH_ARRAY,
      startCoordinates: startGridCoordinates,
      finishCoordinates: endGridCoordinates,
      // distanceStrategy: new EuclideanDistance(),
      onInsertQueue: (node: MinHeapNode) => {
        const tileValue = node.value;
        const tileEntity = this.world.getEntity(`tile-${tileValue}`);
        if (tileEntity) {
          tileEntity.addComponent(TileToBeExplored, { fCost: node.fCost });
          tileEntity.addComponent(DebugRenderedInForeground);
        }
      },
      onSuccess: () => {
        console.log("path", this.aStar.path);
        this.aStar.path.forEach((tileValue) => {
          const tileEntity = this.world.getEntity(`tile-${tileValue}`);
          if (tileEntity) {
            tileEntity.addComponent(TileIsInThePathFound);
            tileEntity.addComponent(DebugRenderedInForeground);
          }
        });
      },
    });
  }

  public update(): void {
    const found = this.aStar.search();
    if (found) {
      console.log('search again');
    }
  }
}
