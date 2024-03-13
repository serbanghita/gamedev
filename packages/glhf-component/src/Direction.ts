import Component from "../../glhf-ecs/src/Component";

export enum Directions {
    NONE, LEFT, RIGHT, UP, DOWN
}

export type DirectionProps = {
    x: Directions.LEFT | Directions.RIGHT | Directions.NONE
    y: Directions.UP | Directions.DOWN | Directions.NONE,
    literal: 'up' | 'down' | 'left' | 'right' | ''
}

export default class Direction extends Component {
    constructor(public properties: DirectionProps) {
        super(properties);
    }
}