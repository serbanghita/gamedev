import Component from "../../glhf-ecs/src/Component";

export enum Directions {
    NONE, LEFT, RIGHT, UP, DOWN
}

export interface IDirectionProps {
    x: Directions.LEFT | Directions.RIGHT | Directions.NONE
    y: Directions.UP | Directions.DOWN | Directions.NONE
}

export default class Direction extends Component {
    constructor(public properties: IDirectionProps) {
        super(properties);
    }
}