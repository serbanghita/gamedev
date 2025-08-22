import { System, Query, World, Entity } from "@serbanghita-gamedev/ecs";
import { Grid, PositionOnGrid, getGridCoordinatesFromTile } from "@serbanghita-gamedev/grid";
import { AStarPathFinding, AStarPathFindingSearchType, AStarPathFindingResultType, MinHeapNode, EuclideanDistance } from "@serbanghita-gamedev/pathfinding";
import TileIsInThePathFound from "../component/TileIsInThePathFound";
import TileToBeExplored from "../component/TileToBeExplored";
import DebugRenderedInForeground from "../component/DebugRenderedInForeground";
import WalkingToDestination from "../component/WalkingToDestination";

type SearchRegistryItem = {
  aStarInstance: AStarPathFinding;
  entity: Entity;
  startGridCoordinates: {x: number, y: number};
  finishGridCoordinates: {x: number, y: number};
  tilesToWalkTo: number[];
  pathWasFound: boolean;
  destinationWasReached: boolean;
};

export default class AStarPathFindingSystem extends System {
  private grid: Grid;

  // A Map with entity => Search item
  // Each Entity is entitled to one A* instance.
  private searchRegistry: Map<string, SearchRegistryItem> = new Map();

  public constructor(
    public world: World,
    public query: Query,
    public map: Entity
  ) {
    super(world, query);

    this.grid =  this.map.getComponent(Grid);
  }

  public initSearchFor(entity: Entity, startCoordinates: { x: number; y: number }, finishCoordinates: { x: number; y: number }) {

    const aStarInstance = new AStarPathFinding({
      matrix1D: this.grid.matrix,
      matrixWidth: this.grid.width,
      matrixHeight: this.grid.height,
      searchType: AStarPathFindingSearchType.BY_STEP,
      resultType: AStarPathFindingResultType.WAYPOINT_PATH_ARRAY,
      startCoordinates,
      finishCoordinates,
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
        //console.log("path", this.aStar.path);
        const registryItem = this.searchRegistry.get(entity.id);

        if (registryItem) {
          registryItem.pathWasFound = true;
          registryItem.tilesToWalkTo = aStarInstance.path;
        }

        // aStarInstance.path.forEach((tileValue) => {
        //   const tileEntity = this.world.getEntity(`tile-${tileValue}`);
        //   if (tileEntity) {
        //     tileEntity.addComponent(TileIsInThePathFound);
        //     tileEntity.addComponent(DebugRenderedInForeground);
        //   }
        // });
      },
    });

    this.searchRegistry.set(entity.id, {
      aStarInstance,
      entity,
      startGridCoordinates: startCoordinates,
      finishGridCoordinates: finishCoordinates,
      destinationWasReached: false, pathWasFound: false, tilesToWalkTo: [],
    });

  }

  public initPlayerSearch(entity: Entity) {
    const positionOnGridEntity = entity.getComponent(PositionOnGrid);

    const player = this.world.getEntity('player') as Entity;
    const positionOnGridPlayer = player.getComponent(PositionOnGrid);

    this.initSearchFor(entity, positionOnGridEntity, positionOnGridPlayer);
  }

  public update(): void {
    this.query.execute().forEach((entity) => {
      if (!this.searchRegistry.has(entity.id)) {
        this.initPlayerSearch(entity);
      }
      const registryItem = this.searchRegistry.get(entity.id) as SearchRegistryItem;

      if (registryItem.pathWasFound) {
        // Re-start the seek n destroy.
        if (registryItem.tilesToWalkTo.length === 0) {
          this.initPlayerSearch(entity);
        } else if (!entity.hasComponent(WalkingToDestination)) {
          // Walk to the next tile.
          const nextTile = registryItem.tilesToWalkTo.shift();
          if (typeof nextTile !== 'undefined') {
            const {x: destinationX, y: destinationY} = getGridCoordinatesFromTile(nextTile, this.grid.config);
            entity.addComponent(WalkingToDestination, {destinationX, destinationY});
          }
        }
      } else {
        registryItem.pathWasFound = registryItem.aStarInstance.search();
        // console.log(registryItem);
      }

    });
  }
}
