import Component from "../../ecs/src/Component";

export interface IsOnMatrixProps {
    tile: number;
}

export default class IsOnMatrix extends Component {
    constructor(public properties: IsOnMatrixProps) {
        super(properties);
    }
}