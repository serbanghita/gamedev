import {Query, System, World} from "@serbanghita-gamedev/ecs";
import {Matrix, Position} from "@serbanghita-gamedev/component";
import {getTileFromXY} from "@serbanghita-gamedev/matrix";

export default class MatrixSystem extends System {

    public constructor(public world: World, public query: Query) {
        super(world, query);
    }

    public update(now: number): void {
        this.query.execute().forEach(entity => {

            const position = entity.getComponent(Position);
            const matrix = entity.getComponent(Matrix);

            getTileFromXY(position.properties.x, position.properties.y, matrix.properties)


        });
    }

}