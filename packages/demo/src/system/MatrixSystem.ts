import {Query, System, World} from "@serbanghita-gamedev/ecs";
import {IsOnMatrix, MatrixConfig, Position} from "@serbanghita-gamedev/component";
import {getTileFromCoordinates} from "@serbanghita-gamedev/matrix";

export default class MatrixSystem extends System {

    public constructor(public world: World, public query: Query) {
        super(world, query);
    }

    public update(now: number): void {
        const map = this.world.getEntity("map");
        if (!map) {
            throw new Error(`"map" entity was not defined in the entities.json`);
        }
        const matrixConfig = map.getComponent(MatrixConfig);


        this.query.execute().forEach(entity => {

            const position = entity.getComponent(Position);
            const isOnMatrix = entity.getComponent(IsOnMatrix);

            // Calculate the tile from Position.
            const tile = getTileFromCoordinates(position.properties.x, position.properties.y, matrixConfig.properties)

            isOnMatrix.properties.tile = tile;

        });
    }

}